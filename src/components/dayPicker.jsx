//this is the section of balls to click which days you need selected.
//The idea pre writing is just (M) (T) (W) (Th) (F)
import { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import * as haptics from "../style/haptics";

const daysOfTheWeek = ["M", "T", "W", "Th", "F", "Sa", "Su"];
const BORDER_WIDTH = 1.5;

export default function DayPicker({ theme, onSelect, error, initialDays }) {
  const [selectedDays, setSelectedDays] = useState(initialDays ?? []);

  const toggleDay = (day) => {
    haptics.select();
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    // Store in weekday order, not tap order. Without this a class tapped
    // W then F then Th displays as "W,F,Th" on the card, which reads like a bug.
    const sorted = daysOfTheWeek.filter((d) => next.includes(d));

    setSelectedDays(sorted);
    onSelect?.(sorted);
  };

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 30,
        },
        styles.container,
        error && styles.containerError,
      ]}
    >
      {daysOfTheWeek.map((day) => {
        const isSelected = selectedDays.includes(day);
        return (
          <Pressable
            key={day}
            onPress={() => toggleDay(day)}
            style={[
              styles.ball,
              {
                backgroundColor: isSelected ? theme.primary : theme.surface,
                borderColor: theme.primary,
                borderWidth: isSelected ? BORDER_WIDTH * 2 : BORDER_WIDTH,
              },
            ]}
          >
            <Text style={{ color: isSelected ? "#FFFFFF" : theme.text }}>
              {day}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 12,
  },
  containerError: { borderWidth: 2, borderColor: "#DC2626" },
  ball: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
