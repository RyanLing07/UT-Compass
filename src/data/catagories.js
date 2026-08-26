import {
  BookOpen,
  Users,
  PartyPopper,
  Home,
  Dumbbell,
  Music,
  Palette,
  Briefcase,
  Heart,
  Star,
  Utensils,
  Computer,
} from "lucide-react-native";

export const CATEGORY_ICONS = {
  BookOpen,
  Users,
  PartyPopper,
  Home,
  Dumbbell,
  Music,
  Palette,
  Briefcase,
  Heart,
  Star,
  Utensils,
  Computer,
};

export const CATEGORY_ICON_OPTIONS = Object.keys(CATEGORY_ICONS);

export const CATEGORY_COLOR_OPTIONS = [
  "#F4B183",
  "#7FC8E8",
  "#B8B0D9",
  "#E8C07D",
  "#82C9B5",
  "#D99AC5",
  "#E98F9E",
  "#A8B8E8",
];

// Seeded into storage on first run only
export const DEFAULT_CATEGORIES = [
  { id: 0, name: "Classes", color: "#F4B183", icon: "BookOpen" },
  { id: 1, name: "Food", color: "#E8C07D", icon: "Utensils" },
  { id: 2, name: "Study Spots", color: "#82C9B5", icon: "BookOpen" },
];

// Seeded into storage on first launch only go see getItems().
export const DEFAULT_ITEMS = [
  {
    id: "sample-welcome",
    categoryId: 0,
    name: "My First Class!",
    tag: "Classrooms",
    locations: [
      {
        building: "GDC",
        room: "2.410",
        days: ["M", "W", "F"],
        hasTime: true,
        start: "10:00 AM",
        end: "11:00 AM",
      },
    ],
  },
];
