/**
 * this is the main layout, simply containing
 * code for keyboard, theme, and ensuring
 * bounds for swipes, modal info, and theme. R.L.
 */
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "../style/darkMode";
import Welcome from "../components/Welcome";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { theme, colorScheme } = useTheme();
  useEffect(() => {
    if (colorScheme) SplashScreen.hideAsync();
  }, [colorScheme]);

  // Failsafe: if colorScheme never 'resolves', then splash would stay forever.
  useEffect(() => {
    const t = setTimeout(() => SplashScreen.hideAsync(), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modalChange" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="categoryModal"
          options={{ presentation: "modal" }}
        />
      </Stack>
      <Welcome />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootLayoutNav />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
