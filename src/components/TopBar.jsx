//This is the topbar for the index, with the icon and the pill below it.
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Plus } from "lucide-react-native";
import { accent } from "../style/styles";
import { CategorySelect } from "./Pill";
import * as haptics from "../style/haptics";

export default function TopBar({
  theme,
  categories,
  current,
  onSelectCategory,
  onLongPressCategory,
  onAddCategory,
  onAddItem,
  title = "UT Compass",
}) {
  return (
    <>
      <View style={styles.top}>
        <View style={styles.brand}>
          <View style={styles.brandBadge}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.brandLogo}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => {
            haptics.tap();
            onAddItem();
          }}
        >
          <Plus size={24} strokeWidth={2.5} color={accent.onTint} />
        </Pressable>
      </View>

      <CategorySelect
        theme={theme}
        categories={categories}
        selectedId={current}
        onSelect={onSelectCategory}
        onLongPress={onLongPressCategory}
        onAdd={onAddCategory}
        size="md"
        style={styles.pillRow}
      />
    </>
  );
}

const styles = StyleSheet.create({
  top: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 20,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  // No background fill, so itll match around what is there.
  brandBadge: { width: 34, height: 34, borderRadius: 9, overflow: "hidden" },
  brandLogo: { width: 34, height: 34 },
  title: { fontSize: 24, fontWeight: "600" },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: accent.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  pillRow: { marginBottom: 4 },
});
