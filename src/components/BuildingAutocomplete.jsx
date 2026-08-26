//This is the autocomplete section to find and match to my dataset. R.L.
import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import buildings from "../data/building.json";

export default function BuildingAutocomplete({
  theme,
  onSelect,
  error,
  initialBuildingId,
}) {
  const initialBuilding = initialBuildingId
    ? buildings.find((b) => b.id === initialBuildingId)
    : null;

  const [query, setQuery] = useState(initialBuilding?.name ?? "");
  const [hasSelected, setHasSelected] = useState(Boolean(initialBuilding));

  const matches =
    hasSelected || query.trim().length === 0
      ? []
      : buildings
          //.filter is SO useful R.L.
          .filter((b) => {
            const searchable = `${b.id ?? ""} ${b.name ?? ""}`.toLowerCase();
            const queryWords = query.toLowerCase().split(" ").filter(Boolean);
            return queryWords.every((word) => searchable.includes(word));
          })
          .slice(0, 5);

  const handleChangeText = (text) => {
    setQuery(text);
    setHasSelected(false);
    onSelect?.(null);
  };

  const handleSelect = (building) => {
    setQuery(building.name);
    setHasSelected(true);
    onSelect?.(building);
  };

  return (
    <View>
      <TextInput
        style={[
          { backgroundColor: theme.background, color: theme.text },
          styles.input,
          error && styles.inputError,
        ]}
        placeholder="Search building (e.g. BEL)"
        placeholderTextColor={theme.text + "80"}
        value={query}
        onChangeText={handleChangeText}
      />
      {matches.length > 0 && (
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 10,
            marginTop: 4,
          }}
        >
          {matches.map((item) => (
            <Pressable
              key={item.id}
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
              onPress={() => handleSelect(item)}
            >
              <Text style={{ color: theme.text }}>
                {item.id} — {item.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 },
  inputError: { borderWidth: 1.5, borderColor: "#DC2626" },
});
