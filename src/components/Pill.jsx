//
//This is the Pill, or more specifically, the nickname for the "select one from a set" row in the app lives here.
// Selected = solid fill in the pill's color. Unselected = transparent with a
// 50%-alpha outline. Both share one style object, so a pill never resizes on
// selection. R.L.
import { Plus as PlusIcon } from "lucide-react-native";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { colors } from "../style/styles";
import { CATEGORY_ICONS } from "../data/catagories";
import * as haptics from "../style/haptics";

const corner = 50;

const SIZES = {
  sm: { paddingVertical: 5, paddingHorizontal: 16, fontSize: 14, icon: 14 },
  md: { paddingVertical: 6, paddingHorizontal: 18, fontSize: 16, icon: 18 },
};

export function Pill({
  label,
  icon: Icon,
  color,
  active = false,
  theme,
  size = "md",
  onPress,
  onLongPress,
}) {
  const s = SIZES[size] ?? SIZES.md;
  const contentColor = active ? colors.light.text : theme.text;

  return (
    <Pressable
      style={[
        styles.pill,
        {
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
        },
        active
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: color + "20", borderColor: color },
      ]}
      onPress={
        onPress &&
        ((e) => {
          haptics.select();
          onPress(e);
        })
      }
      onLongPress={
        onLongPress &&
        ((e) => {
          haptics.press();
          onLongPress(e);
        })
      }
    >
      {Icon && (
        <Icon
          size={s.icon}
          color={contentColor}
          style={label != null && styles.icon}
        />
      )}
      {label != null && (
        <Text
          style={[
            styles.text,
            {
              color: contentColor,
              fontSize: s.fontSize,
              fontWeight: active ? "700" : "500",
            },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// The rounded container the pills scroll inside. R.L.
export function PillRow({ theme, children, style }) {
  return (
    <View
      style={[styles.rowBackground, { backgroundColor: theme.surface }, style]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
      >
        {children}
      </ScrollView>
    </View>
  );
}

//This is the most module of the components, you can use as a filter,
//chooser and more, and you dont have to use,
//onAdd or onLongPress, they are optional. R.L.
export function CategorySelect({
  theme,
  categories,
  selectedId,
  onSelect,
  onLongPress,
  onAdd,
  size = "md",
  style,
}) {
  return (
    <PillRow theme={theme} style={style}>
      {categories.map((cat) => (
        <Pill
          key={cat.id}
          label={cat.name}
          icon={CATEGORY_ICONS[cat.icon]}
          color={cat.color}
          active={selectedId === cat.id}
          theme={theme}
          size={size}
          onPress={() => onSelect(cat.id)}
          onLongPress={onLongPress && (() => onLongPress(cat.id))}
        />
      ))}
      {onAdd && (
        <Pill
          icon={PlusIcon}
          color={theme.text}
          theme={theme}
          size={size}
          onPress={onAdd}
        />
      )}
    </PillRow>
  );
}

//needs to be unified -- TODO
const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: corner,
    borderWidth: 1.5,
    marginRight: 6,
  },
  icon: { marginRight: 6 },
  text: {},
  rowBackground: {
    width: "98%",
    alignSelf: "center",
    paddingVertical: 6,
    borderRadius: corner,
    overflow: "hidden",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
