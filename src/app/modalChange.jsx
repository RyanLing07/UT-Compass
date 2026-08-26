/**
 * Category Modal which contains the information regarding the currently selected (or new)
 * category, including all of the information for it (color, icon, theme). R.L.
 */
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import ThemedTextInput from "../components/ThemedTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check, Trash2 } from "lucide-react-native";
import { accent } from "../style/styles";
import { useTheme } from "../style/darkMode";
import { useState, useEffect } from "react";
import {
  CATEGORY_ICONS,
  CATEGORY_ICON_OPTIONS,
  CATEGORY_COLOR_OPTIONS,
} from "../data/catagories";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../data/storage";
import * as haptics from "../style/haptics";

//arbitrary, but limit to look clean. R.L.
const MAX_NAME_LENGTH = 16;

export default function CategoryModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = id !== undefined;

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(CATEGORY_ICON_OPTIONS[0]);
  const [color, setColor] = useState(CATEGORY_COLOR_OPTIONS[0]);
  const [error, setError] = useState(null);

  //**checks weather they're editing and does what it needs for each*/
  useEffect(() => {
    if (!isEditing) return;
    getCategories().then((categories) => {
      const existing = categories.find((c) => String(c.id) === String(id));
      if (existing) {
        setName(existing.name);
        setIcon(existing.icon);
        setColor(existing.color);
      }
    });
  }, [id]);

  const handleCancel = () => router.back();

  const handleConfirm = async () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      haptics.warn();
      return setError("Give this category a name");
    }

    try {
      if (isEditing) {
        await updateCategory(Number(id), { name: trimmed, icon, color });
      } else {
        await addCategory({ name: trimmed, icon, color });
      }
      haptics.success();
      router.back();
    } catch (err) {
      //just incase it fails!
      haptics.error();
      Alert.alert("Couldn't save this category", "Please try again.");
    }
  };

  const handleDelete = async () => {
    haptics.press();
    const result = await deleteCategory(Number(id));
    if (!result.success) {
      haptics.error();
      Alert.alert(
        "Can't delete this category",
        "Move or delete its items first.",
      );
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
          gestureEnabled: false,
        }}
      />

      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={handleCancel}>
          <ArrowLeft size={20} color={accent.onTint} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>
          {isEditing ? "Edit Category" : "New Category"}
        </Text>
        <Pressable style={styles.iconButton} onPress={handleConfirm}>
          <Check size={20} color={accent.onTint} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Text style={[styles.label, { color: theme.text }]}>Name:</Text>
        <ThemedTextInput
          style={[
            { backgroundColor: theme.surface, color: theme.text },
            styles.input,
            error && styles.inputError,
          ]}
          placeholder="Category name"
          placeholderTextColor={theme.text + "80"}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError(null);
          }}
          maxLength={MAX_NAME_LENGTH}
          returnKeyType="done"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={[styles.label, { color: theme.text }]}>Icon:</Text>
        <View style={styles.grid}>
          {CATEGORY_ICON_OPTIONS.map((key) => {
            const Icon = CATEGORY_ICONS[key];
            const isSelected = icon === key;
            return (
              <Pressable
                key={key}
                onPress={() => {
                  haptics.select();
                  setIcon(key);
                }}
                style={[
                  styles.iconChip,
                  { backgroundColor: theme.surface },
                  isSelected && { borderColor: theme.primary, borderWidth: 2 },
                ]}
              >
                <Icon
                  size={22}
                  color={isSelected ? theme.primary : theme.text}
                />
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Color:</Text>
        <View style={styles.grid}>
          {CATEGORY_COLOR_OPTIONS.map((hex) => {
            const isSelected = color === hex;
            return (
              <Pressable
                key={hex}
                onPress={() => {
                  haptics.select();
                  setColor(hex);
                }}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: hex },
                  isSelected && { borderColor: theme.text, borderWidth: 2 },
                ]}
              />
            );
          })}
        </View>

        {isEditing && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={16} color="#DC2626" />
            <Text style={styles.deleteText}>Delete category</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: accent.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "600" },
  body: { flex: 1, paddingHorizontal: 16 },
  // Room to scroll past the last control while the keyboard is open.
  bodyContent: { paddingBottom: 120 },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 12 },
  inputError: { borderWidth: 1.5, borderColor: "#DC2626" },
  errorText: { color: "#DC2626", fontSize: 12, marginLeft: 8, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  iconChip: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSwatch: { width: 36, height: 36, borderRadius: 18 },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    paddingVertical: 12,
    gap: 6,
  },
  deleteText: { color: "#DC2626", fontWeight: "600" },
});
