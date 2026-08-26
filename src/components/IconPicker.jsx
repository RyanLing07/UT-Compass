//This component is meant to be a clean and nice way to select the icon you want
// The precode idea is a scroll wheel the middle has the Icon in a color
//              _________
//              +   π . i
//             ----------
//--R.L.
import { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { TAGS, TAG_ICONS } from "../data/tags";
import * as haptics from "../style/haptics";

const ITEM_WIDTH = 72;
const SIDE_PADDING = (Dimensions.get("window").width - ITEM_WIDTH) / 2;
const tagList = Object.values(TAGS);

export default function IconPicker({
  theme,
  onSelect,
  horizontalInset = 16,
  initialTag,
}) {
  const initialIndex = initialTag
    ? Math.max(tagList.indexOf(initialTag), 0)
    : 0;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    onSelect?.(tagList[selectedIndex]);
  }, []);

  const handleSnap = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    // Only buzz when the wheel actually lands on a new icon, otherwise a
    // scroll that settles back on the same one still fires.
    if (index !== selectedIndex) haptics.select();
    setSelectedIndex(index);
    onSelect?.(tagList[index]);
  };

  //alot taken from a tutorial ... R.L.
  return (
    <View style={{ marginHorizontal: -horizontalInset }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentOffset={{ x: initialIndex * ITEM_WIDTH, y: 0 }}
        contentContainerStyle={[
          styles.background,
          { paddingHorizontal: SIDE_PADDING, backgroundColor: theme.surface },
        ]}
        onMomentumScrollEnd={handleSnap}
      >
        {tagList.map((tag, index) => {
          const Icon = TAG_ICONS[tag];
          const isSelected = index === selectedIndex;
          return (
            <View
              key={tag}
              style={[
                styles.item,
                isSelected ? styles.iconActive : styles.iconUnactive,
              ]}
            >
              <Icon size={34} color={isSelected ? theme.primary : theme.text} />
            </View>
          );
        })}
      </ScrollView>
      <Text style={[styles.label, { color: theme.text }]}>
        {tagList[selectedIndex]}
      </Text>
    </View>
  );
}

//we need to add it all into one stylesheet
const styles = StyleSheet.create({
  background: { borderRadius: 10, paddingVertical: 12 },
  item: { width: ITEM_WIDTH, alignItems: "center", justifyContent: "center" },
  iconUnactive: { opacity: 0.4 },
  iconActive: { opacity: 1 },
  label: { fontSize: 14, textAlign: "center", marginTop: 6 },
});
