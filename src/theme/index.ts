import { DefaultTheme } from "react-native-paper";
import { CustomSpacing } from "./types";

/**
 * Creates custom spacing function for extended React Native Paper theme
 * Created function uses base value and multiplies it by multiplier number given to it when called.
 * Multiplier defaults to 1.
 *
 * @param baseValue base value
 */
const createCustomSpacing = (baseValue: number): CustomSpacing => (multiplier: number = 1) => {
  return baseValue * multiplier;
};

/**
 * Application theme for React Native Paper
 */
const theme: ReactNativePaper.Theme = {
  ...DefaultTheme,
  fonts: {
    regular: {
      fontFamily: "NotoSans_400Regular",
      fontWeight: "400"
    },
    medium: {
      fontFamily: "NotoSans_700Bold",
      fontWeight: "700"
    },
    light: {
      fontFamily: "NotoSans_400Regular",
      fontWeight: "400"
    },
    thin: {
      fontFamily: "NotoSans_400Regular",
      fontWeight: "400"
    }
  },
  colors: {
    ...DefaultTheme.colors,
    primary: "#899C35",
    error: "#FE0400",
    backgroundDark: "#3E3F44",
    unSelected: "#9E9E9E",
    grey: {
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#D5D5D5",
      A200: "#AAAAAA",
      A400: "#616161",
      A700: "#303030"
    },
    risks: {
      0: "#DDD",
      1: "#626312",
      2: "#A8A217",
      3: "#A8A217",
      4: "#D6CE1C",
      5: "#EE5008",
      6: "#EE5008",
      7: "#A7140A",
      8: "#EE5008"
    }
  },
  roundness: 5,
  spacing: createCustomSpacing(8)
};

export default theme;