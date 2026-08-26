/**
 * Settings menu! -R.L.
 */
import { Stack } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Download,
  Upload,
  Trash2,
  Info,
  Mail,
  Check,
  Hammer,
  Shield,
  Code,
  Camera,
} from "lucide-react-native";
import { useTheme } from "../../style/darkMode";
import { exportData, importData, resetAllData } from "../../data/storage";
import * as haptics from "../../style/haptics";

//INFO TBD
const SUPPORT_EMAIL = "Ryanling.dev@outlook.com";
const APP_NAME = "UT Compass";
const APP_VERSION = "1.0.0";
const GITHUB_URL = "https://github.com/RyanLing07/UT-Compass";
const INSTAGRAM_URL = "https://instagram.com/Ryaniskoolz";
const PRIVACY_URL =
  "https://ryanling07.github.io/UT-Compass/privacy-policy.html";

const THEME_OPTIONS = [
  { mode: "light", label: "Light" },
  { mode: "dark", label: "Dark" },
  { mode: "system", label: "Auto (System)" },
];

//Things I want to add, kept even as just as deadcode because I really do want to add these features. (TODO)
const ROADMAP = ["Widgets and notifications", "Food wheel", "Web version"];

export default function Settings() {
  const { theme, themeMode, setThemeMode } = useTheme();

  //contact button for mailbox
  const handleContact = () => {
    haptics.tap();
    const subject = `${APP_NAME} — Feedback`;
    const body =
      "Describe your issue, question, or feature idea below:\n\n\n\n" +
      `---\nApp: ${APP_NAME} v${APP_VERSION}`;
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          "No email app found",
          `You can reach out directly at ${SUPPORT_EMAIL}!`,
        );
      }
    });
  };

  //export JSON
  const handleExport = async () => {
    haptics.tap();
    try {
      await exportData();
    } catch (error) {
      Alert.alert(
        "Export failed",
        "Something went wrong creating your backup.",
      );
    }
  };

  //import JSON
  const handleImport = () => {
    haptics.press();
    Alert.alert(
      "Import backup?",
      "This will replace everything you've saved with the contents of the file you choose.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          style: "destructive",
          onPress: async () => {
            const result = await importData();
            if (result.success) {
              const skipped = result.skipped
                ? ` ${result.skipped} unreadable record${result.skipped === 1 ? "" : "s"} were skipped.`
                : "";
              haptics.success();
              Alert.alert(
                "Import complete",
                `Restored ${result.imported} entries.${skipped}`,
              );
            } else if (result.reason !== "cancelled") {
              Alert.alert(
                "Import failed",
                "That file couldn't be read as a valid backup.",
              );
            }
          },
        },
      ],
    );
  };

  //reset JSON
  const handleReset = () => {
    haptics.press();
    Alert.alert(
      "Clear all data?",
      "This deletes everything you've saved, including your categories. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Everything",
          style: "destructive",
          onPress: async () => {
            await resetAllData();
            haptics.success();
            Alert.alert(
              "Data cleared",
              "Everything you saved has been removed.",
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
      >
        <Text style={[styles.sectionLabel, { color: theme.text }]}>
          Appearance
        </Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          {THEME_OPTIONS.map(({ mode, label }, index) => (
            <View key={mode}>
              <Pressable
                style={styles.row}
                onPress={() => {
                  haptics.select();
                  setThemeMode(mode);
                }}
              >
                <Text style={[styles.rowText, { color: theme.text, flex: 1 }]}>
                  {label}
                </Text>
                {themeMode === mode && (
                  <Check size={18} color={theme.primary} />
                )}
              </Pressable>
              {index < THEME_OPTIONS.length - 1 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.background },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: theme.text }]}>Data</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Pressable style={styles.row} onPress={handleExport}>
            <Download size={18} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>
              Export Backup
            </Text>
          </Pressable>
          <View
            style={[styles.divider, { backgroundColor: theme.background }]}
          />
          <Pressable style={styles.row} onPress={handleImport}>
            <Upload size={18} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>
              Import Backup
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.text }]}>About</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.row}>
            <Info size={18} color={theme.text} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowText, { color: theme.text }]}>
                {APP_NAME}
              </Text>
              <Text style={[styles.aboutBody, { color: theme.text }]}>
                Your lightweight, offline companion for logging locations and
                finding new spots on campus!
              </Text>
              <Text style={[styles.version, { color: theme.text }]}>
                Version {APP_VERSION}
              </Text>
            </View>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.background }]}
          />
          <Pressable
            style={styles.row}
            onPress={() => {
              haptics.tap();
              Linking.openURL(PRIVACY_URL);
            }}
          >
            <Shield size={18} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>
              Privacy Policy
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.text }]}>
          Feedback
        </Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Pressable style={styles.row} onPress={handleContact}>
            <Mail size={18} color={theme.text} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowText, { color: theme.text }]}>
                Contact Me!
              </Text>
              <Text style={[styles.aboutBody, { color: theme.text }]}>
                Report a bug, ask a question, or suggest a feature! Please reach
                out!
              </Text>
            </View>
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.text }]}>
          Follow Along
        </Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Pressable
            style={styles.row}
            onPress={() => {
              haptics.tap();
              Linking.openURL(GITHUB_URL);
            }}
          >
            <Code size={18} color={theme.text} />

            <View style={{ flex: 1 }}>
              <Text style={[styles.rowText, { color: theme.text }]}>
                Follow me on Github!
              </Text>
            </View>
          </Pressable>
          <View
            style={[styles.divider, { backgroundColor: theme.background }]}
          />
          <Pressable
            style={styles.row}
            onPress={() => {
              haptics.tap();
              Linking.openURL(INSTAGRAM_URL);
            }}
          >
            <Camera size={18} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>
              Follow me on Instagram!
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.text }]}>
          Danger Zone
        </Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Pressable style={styles.row} onPress={handleReset}>
            <Trash2 size={18} color="#DC2626" />
            <Text style={[styles.rowText, { color: "#DC2626" }]}>
              Clear All Data
            </Text>
          </Pressable>
        </View>
        <Text style={[styles.footnote, { color: theme.text }]}>
          UT Compass is an independent student project. It is not affiliated
          with, endorsed by, or sponsored by The University of Texas at Austin.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

//TODO- add unified version R.L.
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "600" },
  body: { flex: 1, paddingHorizontal: 16 },
  bodyContent: { paddingBottom: 32 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.6,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 8,
    textTransform: "uppercase",
  },
  card: { borderRadius: 12, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rowText: { fontSize: 15, fontWeight: "500" },
  divider: { height: 1, marginLeft: 46 },
  aboutBody: { fontSize: 13, opacity: 0.7, marginTop: 2, lineHeight: 18 },
  version: { fontSize: 12, opacity: 0.45, marginTop: 6 },
  footnote: {
    fontSize: 11,
    opacity: 0.45,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 28,
    paddingHorizontal: 12,
  },
});
