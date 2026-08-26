/**
 * This is the timePicker to select what time your classes are, using react-native-community DateTimePicker,
 * that way the clock selector looks and 'is' native looking, rather than a cheap clone. R.L.
 */
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const formatTime = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

// A new location has no saved time, and defaulting to "right now" meant the
// picker opened on something like 2:47 AM, or maybe thats just when I was coding... R.L.
const DEFAULT_START_HOUR = 9;
const DEFAULT_END_HOUR = 10;

const atHour = (hour) => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d;
};

// iOS formats "10:00 AM" and has some errors, thats why the \s makes it united,
// taken from a tutorial. R.L.
const parseTime = (timeString, fallbackHour) => {
  if (!timeString) return atHour(fallbackHour);

  const m = String(timeString).match(/^(\d{1,2}):(\d{2})\s*([AaPp])/);
  if (!m) return atHour(fallbackHour);

  let hours = Number(m[1]);
  const minutes = Number(m[2]);
  const isPM = m[3].toLowerCase() === "p";
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export default function TimePicker({
  theme,
  days = [],
  value = {},
  onChange,
  error,
}) {
  const [startDate, setStartDate] = useState(() =>
    parseTime(value.start, DEFAULT_START_HOUR),
  );
  const [endDate, setEndDate] = useState(() =>
    parseTime(value.end, DEFAULT_END_HOUR),
  );

  useEffect(() => {
    const patch = {};
    if (!value.start) patch.start = formatTime(startDate);
    if (!value.end) patch.end = formatTime(endDate);
    if (Object.keys(patch).length) onChange?.(patch);
    //this is only on mount
  }, []);

  const handleStartChange = (event, selectedDate) => {
    if (!selectedDate) return;
    setStartDate(selectedDate);
    onChange?.({ start: formatTime(selectedDate) });
  };

  const handleEndChange = (event, selectedDate) => {
    if (!selectedDate) return;
    setEndDate(selectedDate);
    onChange?.({ end: formatTime(selectedDate) });
  };

  const dayLabel = days.length > 0 ? days.join(", ") : "Select days first";

  return (
    <View style={error && styles.containerError}>
      <Text style={[styles.label, { color: theme.text }]}>
        Time for {dayLabel}
      </Text>

      {/* The compact DateTimePicker draws its own grey pill and ignores
          textColor unfortunatly. that prop only applies to display="spinner". So contrast
          has to come from behind it.BOO .A burnt-orange tint makes the grey read
          as a iOS control rather than a disabled field. */}
      <View style={[styles.card, { backgroundColor: theme.primary + "12" }]}>
        <View style={styles.column}>
          <Text style={[styles.subLabel, { color: theme.text }]}>Start</Text>
          <DateTimePicker
            value={startDate}
            mode="time"
            display="compact"
            accentColor={theme.primary}
            onChange={handleStartChange}
          />
        </View>

        <View style={styles.column}>
          <Text style={[styles.subLabel, { color: theme.text }]}>End</Text>
          <DateTimePicker
            value={endDate}
            mode="time"
            display="compact"
            accentColor={theme.primary}
            onChange={handleEndChange}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, marginBottom: 6, textAlign: "center" },
  // flex: 1 on each column splits the row evenly, so each label centers over
  column: { flex: 1, alignItems: "center" },
  subLabel: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 6,
    opacity: 0.6,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  containerError: {
    borderWidth: 1.5,
    borderColor: "#DC2626",
    borderRadius: 10,
    paddingVertical: 6,
  },
});
