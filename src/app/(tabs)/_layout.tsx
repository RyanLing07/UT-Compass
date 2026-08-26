/**
 * this is the layout declaring for tabs, including formatting!
 * R.L.
 */
import * as Haptics from "expo-haptics";
import { Tabs, usePathname } from "expo-router";
import { useRef } from "react";
import { Search, BookOpen, Cog, Bell } from "lucide-react-native";
import { useTheme } from "../../style/darkMode";

//This is just the way to shortcut to where each of the sections are declaring. R.L.
const PATH_TO_TAB: Record<string, string> = {
  "/": "index",
  "/map": "map",
  "/updates": "updates",
  "/settings": "settings",
};

export default function TabLayout() {
  //Its here because theme cannot be used in the stylesheet, and to provide hotquick changes instead of flipping individual hex. R.L. will change
  const { theme } = useTheme();
  const onText = theme.primary;
  const offText = theme.text + "A0";
  const offBKG = theme.background;
  const onBKG = theme.primary + "30";

  const pathname = usePathname();
  const lastVisibleTab = useRef("index");
  const current = PATH_TO_TAB[pathname];
  if (current) {
    lastVisibleTab.current = current;
  }

  const iconColor = (name: string) =>
    lastVisibleTab.current === name ? onText : offText;
  const bgColor = (name: string) =>
    lastVisibleTab.current === name ? onBKG : offBKG;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background, height: 60 },
        tabBarActiveTintColor: onText,
        tabBarInactiveTintColor: offText,
        sceneContainerStyle: { backgroundColor: theme.background },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "bold" },
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderColor: theme.surface,
          height: 70,
          paddingBottom: 0,
        },
      }}
      screenListeners={{
        tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "myList",
          tabBarIcon: ({ size }) => (
            <BookOpen
              size={size}
              color={iconColor("index")}
              strokeWidth={1.5}
            />
          ),
          tabBarActiveBackgroundColor: bgColor("index"),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Search",
          tabBarIcon: ({ size }) => (
            <Search size={size} color={iconColor("map")} strokeWidth={1.5} />
          ),
          tabBarActiveBackgroundColor: bgColor("map"),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="updates"
        options={{
          title: "Updates",
          tabBarIcon: ({ size }) => (
            <Bell size={size} color={iconColor("updates")} strokeWidth={1.5} />
          ),
          tabBarActiveBackgroundColor: bgColor("updates"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size }) => (
            <Cog size={size} color={iconColor("settings")} strokeWidth={1.5} />
          ),
          tabBarActiveBackgroundColor: bgColor("settings"),
        }}
      />
    </Tabs>
  );
}
