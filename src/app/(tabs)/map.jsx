/**
 * Map page, containing everything from the different
 * catagories and the list and the modal for the search and app -R.L.
 */
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import places from "../../data/building.json";
import { TAGS, TAG_ICONS, sections } from "../../data/tags.js";
import { colors, accent } from "../../style/styles";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { X, Map, Plus, LocateFixed, School } from "lucide-react-native";
import { showLocation } from "react-native-map-link";
import { useTheme } from "../../style/darkMode";
import { getCategories } from "../../data/storage";
import { Pill, PillRow } from "../../components/Pill";
import * as Location from "expo-location";
import * as haptics from "../../style/haptics";

//UT-Austin area sourced from walking around campus R.L.
const UT_AUSTIN_REGION = {
  latitude: 30.285548,
  longitude: -97.737384,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Roughly a mile in degrees. Beyond this the user isn't on campus, so we zoom out
const NEAR_CAMPUS_DEG = 0.015;

const isNearCampus = (lat, lng) =>
  Math.abs(lat - UT_AUSTIN_REGION.latitude) < NEAR_CAMPUS_DEG &&
  Math.abs(lng - UT_AUSTIN_REGION.longitude) < NEAR_CAMPUS_DEG;

const SEARCH_LABEL_TO_SECTION = {
  Classrooms: { section: "Buildings", subcategory: TAGS.CLASSROOMS },
  "Food & Dining": { section: "Food", subcategory: "All" },
  "Study Spots": { section: "Study Spots", subcategory: "All" },
  '"Must See!"': { section: "Points of Interest", subcategory: "All" },
};

// A place has one `category`, but real places belong to several at once like the
// PCL is a building AND a study spot. When a tag pill is active we match on the
// tag alone on "All" we use category plus the section's `alsoInclude` tags. R.L.
const matchesFilter = (place, section, sub) =>
  sub === "All"
    ? place.category === section.name ||
      (section.alsoInclude ?? []).some((t) => place.tags.includes(t))
    : place.tags.includes(sub);

export default function MapPage() {
  const { theme, colorScheme } = useTheme();
  const { option } = useLocalSearchParams();
  const initial = SEARCH_LABEL_TO_SECTION[option] ?? sections[0];
  const initialSection =
    sections.find((s) => s.name === initial?.section) ?? sections[0];
  const [activeSection, setActiveSection] = useState(initialSection.id);
  const [activeSubcategory, setActiveSubcategory] = useState(
    initial?.subcategory ?? "All",
  );
  const activeCategory =
    sections.find((section) => section.id === activeSection) ?? sections[0];

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const router = useRouter();
  const selectedPlaceSection =
    selectedPlace && sections.find((s) => s.name === selectedPlace.category);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["33%"], []);
  const mapRef = useRef(null);

  // Entries still waiting for verified coordinates would otherwise crash Marker
  // or drop a pin at 0,0 R.L.
  const visiblePlaces = useMemo(
    () =>
      places
        .filter((place) => place.lat != null && place.lng != null)
        .filter((place) =>
          matchesFilter(place, activeCategory, activeSubcategory),
        ),
    [activeCategory, activeSubcategory],
  );

  const filterLabel =
    activeSubcategory === "All" ? activeCategory.name : activeSubcategory;

  // Permission is NOT requested on mount. (AS PER IOS REQUIREMENTS)
  // A cold system prompt with no context gets denied often, and on iOS a denial is permanent
  // the dialog never reappears. Instead we only *check* status here, and request it when the
  // user taps the locate button, so the prompt answers a question they asked. R.L. (very scary)
  const [locationStatus, setLocationStatus] = useState("undetermined");
  const hasLocation = locationStatus === "granted";

  //ADDED: Button toggle for use to not need to scroll all the way back to campus.
  const [centeredOnUser, setCenteredOnUser] = useState(false);

  //permissions
  useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => setLocationStatus(status))
      .catch(() => {});
  }, []);

  const centerOnCampus = () => {
    mapRef.current?.animateToRegion(UT_AUSTIN_REGION, 500);
    setCenteredOnUser(false);
  };

  const centerOnUser = async () => {
    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = current.coords;

    // Off campus? Zoom out so there's some context instead of a tight crop of
    // a street they've never seen
    const zoom = isNearCampus(latitude, longitude)
      ? UT_AUSTIN_REGION.latitudeDelta / 4
      : UT_AUSTIN_REGION.latitudeDelta * 6;
    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta: zoom, longitudeDelta: zoom },
      600,
    );
    setCenteredOnUser(true);
  };

  //lots of information for handling of permissions as apple is very strict, enabling proper handling. R.L.
  const handleLocatePress = async () => {
    haptics.tap();
    try {
      if (centeredOnUser) {
        centerOnCampus();
        return;
      }

      if (locationStatus === "granted") {
        await centerOnUser();
        return;
      }

      if (locationStatus === "denied") {
        // Re-requesting after a denial is a no-go on iOS, so send them to Settings. R.L.
        Alert.alert(
          "Location is turned off",
          "Turn on location access for UT Compass to see where you are on the campus map.",
          [
            { text: "Not now", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationStatus(status);
      if (status === "granted") await centerOnUser();
    } catch (e) {
      Alert.alert(
        "Couldn't find you",
        "Try again in a moment, or check that location services are on.",
      );
    }
  };

  useEffect(() => {
    getCategories()
      .then((loaded) => {
        setSelectedCategoryId((prev) => prev ?? loaded[0]?.id ?? null);
      })
      .catch((err) => {
        // INSERT COMMENT HERE
        console.warn("Failed to load categories", err);
      });
  }, []);

  const openSheet = (place) => {
    haptics.tap();
    setSelectedPlace(place);
    setCenteredOnUser(false);
    bottomSheetRef.current?.snapToIndex(0);
    mapRef.current?.animateToRegion(
      {
        latitude: place.lat,
        longitude: place.lng,
        latitudeDelta: UT_AUSTIN_REGION.latitudeDelta / 4,
        longitudeDelta: UT_AUSTIN_REGION.longitudeDelta / 4,
      },
      500,
    );
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSheetChange = useCallback((index) => {
    if (index === -1) setSelectedPlace(null);
  }, []);

  const handleGoPress = () => {
    haptics.tap();
    showLocation({
      latitude: selectedPlace.lat,
      longitude: selectedPlace.lng,
      title: selectedPlace.name,
      dialogTitle: "Get directions",
      dialogMessage: "Choose an app",
    });
  };

  const handleAddPress = () => {
    haptics.tap();
    router.push({
      pathname: "/modalChange",
      params: { placeId: selectedPlace.id, categoryId: selectedCategoryId },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={UT_AUSTIN_REGION}
        showsPointsOfInterests={false}
        userInterfaceStyle={colorScheme === "dark" ? "dark" : "light"}
        showsUserLocation={hasLocation}
        showsMyLocationButton={false}
      >
        {visiblePlaces.map((place) => {
          // Prefer the icon for the tag being filtered on — otherwise a place
          // tagged ["Fast Food", "Coffee"] shows a burger under Coffee.
          const iconTag =
            activeSubcategory !== "All" &&
            place.tags.includes(activeSubcategory)
              ? activeSubcategory
              : place.tags[0];
          const Icon = TAG_ICONS[iconTag];

          return (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.lat, longitude: place.lng }}
              onPress={(e) => {
                e.stopPropagation();
                openSheet(place);
              }}
            >
              <View
                style={[
                  styles.markerBadge,
                  {
                    backgroundColor: activeCategory.color,
                    borderColor: theme.background,
                  },
                ]}
              >
                {Icon && <Icon size={16} color={colors.light.text} />}
              </View>
            </Marker>
          );
        })}
      </MapView>

      {visiblePlaces.length === 0 && (
        // box-none means it falls through to the map, so itll work. lets touches fall through to the map everywhere except the
        // card, so panning still works behind the empty state.
        <View style={styles.emptyWrap} pointerEvents="box-none">
          <View
            style={[styles.emptyCard, { backgroundColor: theme.background }]}
          >
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Nothing left to show
            </Text>
            <Text style={[styles.emptyBody, { color: theme.text }]}>
              No {filterLabel} spots on the map yet.
            </Text>
          </View>
        </View>
      )}

      {/* One button, two jobs: find me, then take me back to campus. The icon
          swaps so it's obvious which one the next tap does. */}
      <Pressable
        style={[
          styles.locateButton,
          { backgroundColor: theme.background, borderColor: theme.surface },
        ]}
        onPress={handleLocatePress}
        hitSlop={8}
        accessibilityLabel={
          centeredOnUser ? "Back to campus" : "Show my location"
        }
      >
        {centeredOnUser ? (
          <School size={22} color={theme.primary} strokeWidth={2} />
        ) : (
          <LocateFixed
            size={22}
            color={hasLocation ? theme.primary : theme.text}
            strokeWidth={2}
          />
        )}
      </Pressable>

      <View
        style={[
          styles.tabBar,
          { backgroundColor: theme.background, borderColor: theme.background },
        ]}
      >
        {/*Catagory*/}
        <PillRow theme={theme} style={styles.pillRow}>
          {sections.map((section) => (
            <Pill
              key={section.id}
              label={section.name}
              icon={section.icon}
              color={section.color}
              active={activeSection === section.id}
              theme={theme}
              size="md"
              onPress={() => {
                setActiveSection(section.id);
                setActiveSubcategory("All");
              }}
            />
          ))}
        </PillRow>

        <View style={[styles.hairline, { borderBottomColor: theme.surface }]} />
        {/*SubCatagory*/}
        <PillRow theme={theme} style={styles.pillRow}>
          {["All", ...activeCategory.subCatagories].map((name) => (
            <Pill
              key={name}
              label={name}
              icon={TAG_ICONS[name]}
              color={activeCategory.color}
              active={activeSubcategory === name}
              theme={theme}
              size="sm"
              onPress={() => setActiveSubcategory(name)}
            />
          ))}
        </PillRow>
      </View>
      {/*BOTTOM MODAL, SHOULD SEPERATE TO COMPONENT (TODO)*/}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        onChange={handleSheetChange}
        backgroundStyle={{
          backgroundColor: theme.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        handleStyle={{ paddingTop: 8, paddingBottom: 2 }}
        handleIndicatorStyle={{ backgroundColor: theme.surface }}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedPlace && (
            <>
              <View style={styles.sheetHeader}>
                <Text style={[styles.sheetName, { color: theme.text }]}>
                  {selectedPlace.name}
                </Text>
                <Pressable style={styles.closeButton} onPress={closeSheet}>
                  <X size={24} color={theme.text} />
                </Pressable>
              </View>

              <View style={styles.sheetBody}>
                <Text style={[styles.sheetDescription, { color: theme.text }]}>
                  {selectedPlace.description === ""
                    ? "Currently no description! Check back later please."
                    : selectedPlace.description}
                </Text>

                <View style={styles.sheetActions}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: selectedPlaceSection?.color },
                    ]}
                    onPress={handleGoPress}
                  >
                    <Map
                      size={32}
                      strokeWidth={1.8}
                      color={colors.light.text}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: colors.light.text },
                      ]}
                    >
                      Go
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: selectedPlaceSection?.color },
                    ]}
                    onPress={handleAddPress}
                  >
                    <Plus
                      size={32}
                      strokeWidth={1.8}
                      color={colors.light.text}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: colors.light.text },
                      ]}
                    >
                      Add
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  tabBar: {
    flexDirection: "column",
    alignContent: "flex-start",
    borderTopWidth: 1,
    paddingBottom: 2,
  },
  pillRow: { marginVertical: 8 },
  hairline: { width: "95%", borderBottomWidth: 2, alignSelf: "center" },
  locateButton: {
    position: "absolute",
    right: 16,
    bottom: 190,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  markerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },

  emptyWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 20,
    gap: 8,
    maxWidth: 320,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700" },
  emptyBody: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },

  sheetContent: { flex: 1, paddingHorizontal: 20, paddingTop: 0 },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: accent.tint,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  sheetName: { flex: 1, fontSize: 18, fontWeight: "700" },
  sheetDescription: { flex: 1, fontSize: 14, opacity: 0.7, lineHeight: 20 },
  sheetBody: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  sheetActions: { flexDirection: "column", gap: 8 },
  actionButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 70,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  actionButtonText: { fontSize: 13, fontWeight: "800" },
});
