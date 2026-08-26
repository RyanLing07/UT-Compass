/**
 * Index page of the code, which is the main menu, so all of the information like
 * all of the information about classes, index just by vitue of just being the main page R.L.
 */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useTheme } from "../../style/darkMode";
import { MapPin, ClipboardCheck, Plus } from "lucide-react-native";
import { showLocation } from "react-native-map-link";
import { accent } from "../../style/styles";
import buildingsData from "../../data/building.json";
import { TAG_ICONS } from "../../data/tags";
import { getItems, getCategories } from "../../data/storage";
import TopBar from "../../components/TopBar";
import * as haptics from "../../style/haptics";

const buildings = Object.fromEntries(buildingsData.map((b) => [b.id, b]));

//This is an IOS way for being able to make sure the title card never show differently,
//thats why some read before like 10am-11am vs 10-11am -- taken from a tutorial. R.L.
const MERIDIEM = /\s*([AaPp][Mm])\s*$/;

const formatTimeRange = (start, end) => {
  const meridiem = (t) => (String(t).match(MERIDIEM) || [])[1]?.toUpperCase();
  const a = meridiem(start);
  const b = meridiem(end);
  if (a && a === b) {
    return `${String(start).replace(MERIDIEM, "")} – ${end}`;
  }
  return `${start} – ${end}`;
};

// this is just a simple check if weather the current places are 'valid'. R.L.
const hasCoords = (o) => o && o.lat != null && o.lng != null;

//handles menu opening when location is clicked. R.L.
const openDirections = (loc) => {
  if (hasCoords(loc)) {
    showLocation({
      latitude: loc.lat,
      longitude: loc.lng,
      title: loc.name ?? `${loc.building} ${loc.room}`,
      dialogTitle: "Get directions",
      dialogMessage: "Choose an app",
    });
    return;
  }
  // some places dont have location yet (TODO), so this is the safeguard.
  const b = buildings[loc.building];
  if (!hasCoords(b)) {
    // no coords anywhere for this one, so let the user know instead of doing nothing
    Alert.alert(
      "No location on file",
      "This spot doesn't have a location saved yet.",
    );
    return;
  }
  showLocation({
    latitude: b.lat,
    longitude: b.lng,
    title: `${b.name} (${loc.building} ${loc.room})`,
    dialogTitle: "Get directions",
    dialogMessage: "Choose an app",
  });
};

export default function Index() {
  const { theme } = useTheme();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  // items starts empty, so without this the empty card renders for a frame
  // before AsyncStorage resolves. if it resets, its gonna flash the screen white so DONT. R.L.
  const [loaded, setLoaded] = useState(false);
  //fades the content so that it swaps from blank to the list, that means its
  //not on the main thread until its loaded, or ittll just keep mounting forever... as
  //it took me 6 hours to find out.... R.L.
  const fade = useRef(new Animated.Value(0)).current;

  //This is the check to ensure that the places are loaded before the page is shown.
  useEffect(() => {
    if (!loaded) return;
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [loaded, fade]);

  //when put on the focus screen then open it
  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getItems(), getCategories()])
        .then(([storedItems, storedCategories]) => {
          if (!active) return;
          setItems(storedItems);
          setCategories(storedCategories);
          setLoaded(true);
          setCurrent((prev) => {
            const stillExists = storedCategories.some((c) => c.id === prev);
            return stillExists ? prev : (storedCategories[0]?.id ?? 0);
          });
        })
        .catch((err) => {
          // without this, a failed AsyncStorage read leaves loaded stuck false forever
          if (!active) return;
          console.warn("Failed to load items/categories", err);
          setItems([]);
          setCategories([]);
          setLoaded(true);
        });
      return () => {
        active = false;
      };
    }, []),
  );

  const visible = items.filter((item) => item.categoryId === current);
  const currentCategory = categories.find((c) => c.id === current);
  const isEmpty = loaded && visible.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar
        theme={theme}
        categories={categories}
        current={current}
        onSelectCategory={setCurrent}
        onLongPressCategory={(id) =>
          router.push({ pathname: "/categoryModal", params: { id } })
        }
        onAddCategory={() => router.push("/categoryModal")}
        onAddItem={() => router.push("/modalChange")}
      />

      <Animated.ScrollView
        style={[
          styles.content,
          { backgroundColor: theme.background, opacity: fade },
        ]}
        contentContainerStyle={isEmpty && styles.emptyContent}
      >
        {visible.map((item) => {
          const Icon = TAG_ICONS[item.tag];

          return (
            <Pressable
              key={item.id}
              style={[styles.card, { backgroundColor: theme.surface + "60" }]}
              onLongPress={() => {
                haptics.press();
                router.push({
                  pathname: "/modalChange",
                  params: { itemId: item.id },
                });
              }}
            >
              <View
                style={[styles.cardIcon, { backgroundColor: theme.surface }]}
              >
                {Icon && <Icon size={18} color={accent.onTint} />}
              </View>

              <View style={styles.cardBody}>
                <Text style={[styles.class, { color: theme.text }]}>
                  {item.name}
                </Text>
              </View>

              <View style={styles.rightGroup}>
                {item.locations.map((loc) => {
                  const locationLabel =
                    loc.name ?? `${loc.building} ${loc.room}`;
                  const hasSchedule = Boolean(loc.days && loc.start && loc.end);
                  const scheduleLabel = hasSchedule
                    ? `${loc.days.join(",")} | ${formatTimeRange(loc.start, loc.end)}`
                    : null;

                  return (
                    <Pressable
                      key={loc.name ?? `${loc.building}-${loc.room}`}
                      onPress={() => {
                        haptics.tap();
                        openDirections(loc);
                      }}
                    >
                      {({ pressed }) => (
                        <View
                          style={[
                            styles.roomChip,
                            pressed && styles.roomChipPressed,
                          ]}
                        >
                          <MapPin size={12} color={accent.onTint} />
                          {hasSchedule ? (
                            <View>
                              <Text style={styles.building}>
                                {locationLabel}
                              </Text>
                              <Text style={styles.roomMeta}>
                                {scheduleLabel}
                              </Text>
                            </View>
                          ) : (
                            <Text style={styles.building}>{locationLabel}</Text>
                          )}
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          );
        })}

        {!loaded ? null : isEmpty ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: theme.surface + "60" },
            ]}
          >
            <View
              style={[styles.emptyIcon, { backgroundColor: theme.surface }]}
            >
              <ClipboardCheck size={22} color={accent.onTint} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Nothing left to show
            </Text>
            <Text style={[styles.emptyBody, { color: theme.text }]}>
              {currentCategory
                ? `No ${currentCategory.name} yet. Press + to add something.`
                : "Press + to add something."}
            </Text>
            <Pressable
              style={[styles.emptyButton, { backgroundColor: accent.tint }]}
              onPress={() => {
                haptics.tap();
                router.push("/modalChange");
              }}
            >
              <Plus size={18} strokeWidth={2.2} color={accent.onTint} />
              <Text style={[styles.emptyButtonText, { color: accent.onTint }]}>
                Add
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ClipboardCheck size={20} color={theme.text} />
            <Text style={[styles.emptyStateText, { color: theme.text }]}>
              That's everything on file.
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

//TODO -- unify stylesheet, these being different in every page is insane. R.L.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 60,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
  },
  class: {
    fontSize: 16,
    fontWeight: "600",
  },
  rightGroup: {
    flexDirection: "column",
    alignItems: "flex-end",
    flexShrink: 0,
    gap: 6,
  },
  roomChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: accent.tint,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  roomChipPressed: {
    opacity: 0.5,
  },
  building: {
    fontSize: 12,
    fontWeight: "600",
    color: accent.onTint,
  },
  roomMeta: {
    fontSize: 10,
    fontWeight: "500",
    color: accent.onTint,
    opacity: 0.75,
    marginTop: 1,
  },

  emptyCard: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 8,
    marginHorizontal: 8,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyBody: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 19,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 50,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 20,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: 12,
    marginTop: 6,
  },
});
