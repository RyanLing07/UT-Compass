//all colors: light, dark, and pastels and accent colors.
import { StyleSheet } from "react-native";

export const colors = {
  light: {
    primary: "#BF5700", //HOOKEM
    secondary: "#3D8BA8",
    secondaryPressed: "#004D69", //HOOKEMBLUE
    accentGold: "#F2A900",
    accentGreen: "#43695B",
    background: "#FFFFFF",
    surface: "#F4F0EC",
    text: "#333F48",
  },
  dark: {
    primary: "#BF5700", // HOOKEM
    secondary: "#4FA8CC",
    secondaryPressed: "#3D8BA8", // DARKER LIGHT BLUE HOOKEM
    accentGold: "#F2A900",
    accentGreen: "#6FA890",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#F2F2F2",
  },
};

export const pastels = {
  peach: "#FF9440",
  sand: "#FFCF5C",
  sage: "#74C48F",
  sky: "#5FB5E5",
  mint: "#5FE5BE",
  stone: "#CCBEA6",
};

export const accent = {
  solid: "#BF5700",
  onSolid: "#FFE9D2",
  tint: "#BF57001A",
  onTint: "#BF5700",
};
