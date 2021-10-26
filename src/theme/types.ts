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
  }
}