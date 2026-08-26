/**
 * This is the welcome splash screen, a very simple one but does the trick,
 * has all the information needed and closes when you need, simple.
 *                                                          R.L.
 * This was based on a template found on the offical welcome page info for react native on
 * its documentation.
 */
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plus, Hand, Search, ShieldCheck } from "lucide-react-native";
import { accent } from "../style/styles";
import { useTheme } from "../style/darkMode";
import * as haptics from "../style/haptics";

// Bump the suffix if I ever want there to be a new round or after an update. R.L.
const SEEN_KEY = "ut-compass:welcome-seen:v1";

const STEPS = [
  {
    Icon: Plus,
    title: "Press +",
    body: "Add a class, club, or anywhere you need to be.",
  },
  {
    Icon: Hand,
    title: "Hold to edit",
    body: "Long-press any card to change or delete it.",
  },
  {
    Icon: Search,
    title: "Search the Forty Acres",
    body: "Find buildings, food, study spots, and landmarks across campus.",
  },
];

export default function Welcome() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(SEEN_KEY)
      .then((seen) => {
        if (active && !seen) setVisible(true);
      })
      // If storage fails, don't trap the user behind an overlay that
      // can never be dismissed — just skip the intro.
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    Animated.timing(fade, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, fade]);

  const dismiss = async () => {
    haptics.success();
    setVisible(false);
    try {
      await AsyncStorage.setItem(SEEN_KEY, "true");
    } catch (e) {
      // Worst case they see the intro again next launch. Not worth blocking on.  R.L.
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible
      transparent={false}
      animationType="fade"
      onRequestClose={dismiss}
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: theme.background, opacity: fade },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
            resizeMode="cover"
          />

          <Text style={[styles.welcome, { color: theme.text }]}>
            Welcome to
          </Text>
          <Text style={[styles.appName, { color: accent.solid }]}>
            UT Compass
          </Text>
          <Text style={[styles.tagline, { color: theme.text }]}>
            Your free, offline companion for getting around campus.
          </Text>

          <View style={styles.steps}>
            {STEPS.map(({ Icon, title, body }) => (
              <View
                key={title}
                style={[styles.step, { backgroundColor: theme.surface }]}
              >
                <View
                  style={[styles.stepIcon, { backgroundColor: accent.tint }]}
                >
                  <Icon size={20} strokeWidth={2.2} color={accent.onTint} />
                </View>
                <View style={styles.stepText}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>
                    {title}
                  </Text>
                  <Text style={[styles.stepBody, { color: theme.text }]}>
                    {body}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.privacy, { borderColor: theme.text + "20" }]}>
            <ShieldCheck
              size={18}
              color={theme.text}
              style={{ opacity: 0.6 }}
            />
            <Text style={[styles.privacyText, { color: theme.text }]}>
              No tracking, no accounts, no ads. Everything you save stays on
              your device.
            </Text>
          </View>

          <Text style={[styles.signoff, { color: theme.text }]}>
            By a Longhorn, for Longhorns.
          </Text>

          <Pressable
            style={[styles.button, { backgroundColor: accent.solid }]}
            onPress={dismiss}
          >
            <Text style={styles.buttonText}>Hook 'em!</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

//need to match styles - TODO R.L.
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 18,
    alignSelf: "center",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.6,
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 2,
  },
  tagline: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 21,
    marginTop: 10,
    paddingHorizontal: 8,
  },

  steps: { marginTop: 28, gap: 10 },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: "700" },
  stepBody: { fontSize: 13, opacity: 0.7, lineHeight: 18, marginTop: 2 },

  privacy: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 22,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  privacyText: { flex: 1, fontSize: 13, opacity: 0.7, lineHeight: 18 },

  signoff: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.5,
    marginTop: 20,
  },

  button: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "800", color: "#FFFFFF" },
});
