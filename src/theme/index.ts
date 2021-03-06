import { DefaultTheme } from "react-native-paper";
import { CustomSpacing } from "./types";
import { FundGroup } from "../generated/client";

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
    success: "#359c48",
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
    fundGroup: {
      [FundGroup.Active]: "#d83c3c",
      [FundGroup.Passive]: "#d83c3c",
      [FundGroup.FixedIncome]: "#5da35d",
      [FundGroup.Balanced]: "#ff950b",
      [FundGroup.Dimension]: "#767676",
      [FundGroup.Spiltan]: "#767676"
    }
  },
  roundness: 5,
  spacing: createCustomSpacing(8)
};

export default theme;