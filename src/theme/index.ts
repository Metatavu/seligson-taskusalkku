import { DefaultTheme } from "react-native-paper";
import { CustomSpacing } from "./types";

/**
 * Creates custom spacing function for extended React Native Paper theme
 * Created function uses base value and multiplies it by multiplier number given to it when called.
 * Multiplier defaults to 1.
 *
 * @param baseValue base value
 */
export const createCustomSpacing = (baseValue: number): CustomSpacing => (multiplier: number = 1) => {
  return baseValue * multiplier;
};

/**
 * Application theme for React Native Paper
 */
export const theme: ReactNativePaper.Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#899C35"
  },
  roundness: 5,
  spacing: createCustomSpacing(8)
};