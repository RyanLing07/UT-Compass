/**
 * this is where all of the information from other components to make a larger componenets
 * that the main add to be used by the catagory modal
 */
import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import ThemedTextInput from "./ThemedTextInput";
import { Trash2 } from "lucide-react-native";
import BuildingAutocomplete from "./BuildingAutocomplete";
import DayPicker from "./dayPicker";
import TimePicker from "./timePicker";
import * as haptics from "../style/haptics";

export default function LocationBlock({
  theme,
  value,
  onChange,
  onRemove,
  errors,
}) {
  const hasAnyError = errors && Object.keys(errors).length > 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface },
        hasAnyError && styles.containerError,
      ]}
    >
      <View style={styles.titleRow}>
        <Text
          style={[
            styles.label,
            { color: theme.text, marginTop: 0, marginBottom: 10 },
          ]}
        >
          Location:
        </Text>
        {onRemove && (
          <Pressable
            onPress={() => {
              haptics.press();
              onRemove();
            }}
            style={{ transform: [{ translateY: -6 }] }}
          >
            <Trash2 size={18} color={theme.text} />
          </Pressable>
        )}
      </View>

      <BuildingAutocomplete
        theme={theme}
        onSelect={(building) => onChange({ building: building?.id ?? null })}
        error={Boolean(errors?.building)}
        initialBuildingId={value.building}
      />
      {errors?.building && (
        <Text style={styles.errorText}>{errors.building}</Text>
      )}

      <Text style={[styles.label, { color: theme.text }]}>
        Room # (optional):
      </Text>
      <ThemedTextInput
        keyboardType="decimal-pad"
        inputMode="decimal"
        style={[
          { backgroundColor: theme.background, color: theme.text },
          styles.input,
        ]}
        placeholder="Room"
        placeholderTextColor={theme.text + "80"}
        value={value.room}
        onChangeText={(text) => onChange({ room: text })}
      />

      <View style={styles.toggleRow}>
        <Text style={[styles.label, { color: theme.text, marginTop: 0 }]}>
          Add a date and time?
        </Text>
        <Switch
          value={value.hasTime}
          onValueChange={(hasTime) => {
            haptics.select();
            onChange({ hasTime });
          }}
          trackColor={{ false: theme.text + "40", true: theme.primary }}
        />
      </View>

      {value.hasTime && (
        <>
          <DayPicker
            theme={theme}
            onSelect={(days) => onChange({ days })}
            error={Boolean(errors?.days)}
            initialDays={value.days}
          />
          {errors?.days && <Text style={styles.errorText}>{errors.days}</Text>}

          <TimePicker
            theme={theme}
            days={value.days}
            value={{ start: value.start, end: value.end }}
            onChange={(patch) => onChange(patch)}
            error={Boolean(errors?.time)}
          />
          {errors?.time && <Text style={styles.errorText}>{errors.time}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: 12, marginTop: 16 },
  containerError: { borderWidth: 1.5, borderColor: "#DC2626" },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 12 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: { color: "#DC2626", fontSize: 12, marginLeft: 8, marginTop: 4 },
});
c;
