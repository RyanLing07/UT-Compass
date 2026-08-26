/**
 * This is the update page, which is really just a glorified changelog, it
 * just feels like a nice addition to really make it feel personable. R.L.
 */
import { Stack } from "expo-router";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles } from "lucide-react-native";
import { useTheme } from "../../style/darkMode";

// Title: name,
//Subtitle: date,
// Notes: Description,
//could use some work R.L.
const CHANGELOG = [
  {
    title: "UT Compass is here!",
    subtitle: "August 2026",
    notes: [
      "Today the app is officially available! I hope you all enjoy it, and if you have any questions or just want to say hi, please reach out on the settings page! - R.L.",
    ],
  },
];

export default function Changelog() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>What's New!</Text>
      </View>

      <ScrollView style={styles.body}>
        {CHANGELOG.map((entry, entryIndex) => (
          <View
            key={entryIndex}
            style={[styles.card, { borderColor: theme.primary + "40" }]}
          >
            <View
              style={[styles.accentBar, { backgroundColor: theme.primary }]}
            />

            <View style={styles.cardContent}>
              <View style={styles.entryHeader}>
                <Sparkles size={16} color={theme.primary} />
                <Text style={[styles.entryTitle, { color: theme.text }]}>
                  {entry.title}
                </Text>
              </View>
              {entry.subtitle && (
                <Text style={[styles.subtitle, { color: theme.text }]}>
                  {entry.subtitle}
                </Text>
              )}

              {entry.notes.map((note, i) => (
                <View key={i} style={styles.noteRow}>
                  <View
                    style={[styles.bullet, { backgroundColor: theme.primary }]}
                  />
                  <Text style={[styles.note, { color: theme.text }]}>
                    {note}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

//TODO: Unify
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "600" },
  body: { flex: 1, paddingHorizontal: 16 },
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: "hidden",
    marginBottom: 16,
  },
  accentBar: { width: 5 },
  cardContent: { flex: 1, padding: 14 },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  entryTitle: { fontSize: 17, fontWeight: "700" },
  subtitle: { fontSize: 13, opacity: 0.6, marginBottom: 10, marginLeft: 22 },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  bullet: { width: 5, height: 5, borderRadius: 2.5, marginTop: 7 },
  note: { flex: 1, fontSize: 14, lineHeight: 20 },
});
