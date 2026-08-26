//This is very loosely based on code written on the react native documentation for storage with JSON's AsyncStorage,
//adapted to my needs. From React Native async storage.
//
//This contains ALL of the code relating to
//information being moved within and out the app, utilizing Async.
//
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_CATEGORIES, DEFAULT_ITEMS } from "./catagories";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
const ITEMS_KEY = "items";
const CATEGORIES_KEY = "categories";

export async function getItems() {
  try {
    const json = await AsyncStorage.getItem(ITEMS_KEY);
    if (json) return JSON.parse(json);
    // First launch only. An empty list makes the app look like it does
    // nothing, so we seed one example the user can edit or delete.
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(DEFAULT_ITEMS));
    return DEFAULT_ITEMS;
  } catch (error) {
    console.error("Failed to load items:", error);
    return [];
  }
}

export async function saveItems(items) {
  try {
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error("Failed to save items:", error);
    return false;
  }
}

export async function addItem(newItem) {
  const items = await getItems();
  const updated = [...items, newItem];
  await saveItems(updated);
  return updated;
}

export async function updateItem(id, patch) {
  const items = await getItems();
  const updated = items.map((item) =>
    item.id === id ? { ...item, ...patch } : item,
  );
  await saveItems(updated);
  return updated;
}

export async function deleteItem(id) {
  const items = await getItems();
  const updated = items.filter((item) => item.id !== id);
  await saveItems(updated);
  return updated;
}

export async function getCategories() {
  try {
    const json = await AsyncStorage.getItem(CATEGORIES_KEY);
    if (json) return JSON.parse(json);
    await AsyncStorage.setItem(
      CATEGORIES_KEY,
      JSON.stringify(DEFAULT_CATEGORIES),
    );
    return DEFAULT_CATEGORIES;
  } catch (error) {
    console.error("Failed to load categories:", error);
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategories(categories) {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error("Failed to save categories:", error);
    return false;
  }
}

export async function addCategory(newCategory) {
  const categories = await getCategories();
  const nextId =
    categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 0;
  const updated = [...categories, { ...newCategory, id: nextId }];
  await saveCategories(updated);
  return updated;
}

export async function updateCategory(id, patch) {
  const categories = await getCategories();
  const updated = categories.map((c) => (c.id === id ? { ...c, ...patch } : c));
  await saveCategories(updated);
  return updated;
}

export async function deleteCategory(id) {
  const items = await getItems();
  if (items.some((item) => item.categoryId === id)) {
    return { success: false, reason: "in-use" };
  }
  const categories = await getCategories();
  const updated = categories.filter((c) => c.id !== id);
  await saveCategories(updated);
  return { success: true, categories: updated };
}

export async function exportData() {
  const items = await getItems();
  const categories = await getCategories();
  const payload = { exportedAt: new Date().toISOString(), items, categories };

  const file = new File(Paths.document, "ut-compass-backup.json");
  if (file.exists) {
    file.delete();
  }
  file.create();
  await file.write(JSON.stringify(payload, null, 2));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: "application/json" });
  }
  return file.uri;
}

export async function importData() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
  });
  if (result.canceled) return { success: false, reason: "cancelled" };

  try {
    const pickedFile = new File(result.assets[0].uri);
    const content = await pickedFile.text();
    const payload = JSON.parse(content);

    if (!Array.isArray(payload.items) || !Array.isArray(payload.categories)) {
      return { success: false, reason: "invalid" };
    }

    // Shape-check every record or itll crash if there is anything off or wrong, which only be fixed by reseting the app. R.L.
    const categories = payload.categories.filter(
      (c) => c && typeof c.name === "string" && c.id !== undefined,
    );
    const categoryIds = new Set(categories.map((c) => c.id));
    const fallbackId = categories[0]?.id ?? 0;

    const items = payload.items
      .filter(
        (i) =>
          i &&
          i.id !== undefined &&
          typeof i.name === "string" &&
          Array.isArray(i.locations),
      )
      .map((i) => ({
        ...i,
        categoryId: categoryIds.has(i.categoryId) ? i.categoryId : fallbackId,
        locations: i.locations.filter((l) => l && typeof l === "object"),
      }));

    if (categories.length === 0) {
      return { success: false, reason: "invalid" };
    }

    await saveItems(items);
    await saveCategories(categories);
    return {
      success: true,
      imported: items.length,
      skipped: payload.items.length - items.length,
    };
  } catch (error) {
    console.error("Failed to import data:", error);
    return { success: false, reason: "parse-error" };
  }
}

export async function resetAllData() {
  //writes empty rather than removing! R.L.
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify([]));
  await AsyncStorage.setItem(
    CATEGORIES_KEY,
    JSON.stringify(DEFAULT_CATEGORIES),
  );
}
