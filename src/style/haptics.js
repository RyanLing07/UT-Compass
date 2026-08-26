// One place for every buzz in the app,
// a light tick for choosing among options,
// a firmer tap for buttons that act,
// and notification patterns for outcomes.
//
//That is a very swave paragraph, but its true!
//
//R.L.
//
import * as Haptics from "expo-haptics";

//if it doesnt work then eehh okay.
const safe = (fn) => () => {
  try {
    fn();
  } catch (e) {}
};

// Picking one option from a set: pills, day circles, icon wheel, theme rows.
export const select = safe(() => Haptics.selectionAsync());

// A button that does something!
export const tap = safe(() =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
);

// Heavier press!
export const press = safe(() =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
);

// Outcomes/Complete
export const success = safe(() =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
);
//warn
export const warn = safe(() =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
);
//error
export const error = safe(() =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
);
