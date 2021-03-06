import { FundGroup } from "../generated/client";

/**
 * Type for extended custom spacing function
 */
export type CustomSpacing = (multiplier?: number) => number;

/**
 * Type defining function that creates extended custom spacing function from given base value
 */
export type CreateCustomSpacing = (baseValue: number) => CustomSpacing;

/**
 * Definition of all extensions to React Native Paper theme
 */
declare global {
  namespace ReactNativePaper {
    interface Theme {
      spacing: CustomSpacing;
    }

    interface ThemeColors {
      backgroundDark: string;
      success: string;
      unSelected: string;
      grey: {
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        A100: string;
        A200: string;
        A400: string;
        A700: string;
      },
      fundGroup: {
        [ K in FundGroup ]: string
      };
    }
  }
}