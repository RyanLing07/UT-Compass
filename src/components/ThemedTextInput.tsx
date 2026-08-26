//This is the themedTextInput, it just ensures that the keyboard appearance matches the theme.
import { forwardRef } from "react";
import { TextInput as RNTextInput, TextInputProps } from "react-native";
import { useTheme } from "../style/darkMode";

const ThemedTextInput = forwardRef<RNTextInput, TextInputProps>(
  (props, ref) => {
    const { colorScheme } = useTheme();
    return (
      <RNTextInput
        ref={ref}
        keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
        {...props}
      />
    );
  },
);

export default ThemedTextInput;
