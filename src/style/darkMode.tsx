/**
 * This code is very much based on the DarkMode Tutorial from the offical reactNative tutorial.
 * Adapted to my use.
 *
 * Contains all code for changing the colorsceme.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "./styles";

const STORAGE_KEY = "theme";

type ColorScheme = "light" | "dark";
type ThemeMode = ColorScheme | "system";

type ThemeContextType = {
  colorScheme: ColorScheme;
  theme: typeof colors.light;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [systemScheme, setSystemScheme] = useState<ColorScheme>(
    (Appearance.getColorScheme() as ColorScheme) || "light",
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeModeState(saved);
      }
    });
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme((colorScheme as ColorScheme) || "light");
    });
    return () => subscription.remove();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem(STORAGE_KEY, mode);
  };

  const colorScheme: ColorScheme =
    themeMode === "system" ? systemScheme : themeMode;

  //change the theme!
  const toggleTheme = async () => {
    const next: ColorScheme = colorScheme === "dark" ? "light" : "dark";
    await setThemeMode(next);
  };

  const value: ThemeContextType = {
    colorScheme,
    theme: colors[colorScheme],
    themeMode,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

//use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
