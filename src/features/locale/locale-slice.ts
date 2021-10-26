import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import strings from "../../localization/strings";
import { Language } from "../../types/config";

/**
 * Interface describing locale state in Redux
 */
export interface LocaleState {
  language?: Language;
}

/**
 * Initial locale state
 */
const initialState: LocaleState = { };

/**
 * Locale slice of Redux store
 */
export const localeSlice = createSlice({
  name: "locale",
  initialState: initialState,
  reducers: {
    setLanguage: (state, { payload }: PayloadAction<Language>) => {
      state.language = payload;
      strings.setLanguage(payload);
    }
  }
});

/**
 * Locale actions from created locale slice
 */
export const { setLanguage } = localeSlice.actions;

/**
 * Select language selector, used with useAppSelector custom hook defined for Redux store
 *
 * @param state Redux store root state
 * @returns current language from Redux store
 */
export const selectLanguage = (state: RootState) => state.locale.language;

/**
 * Reducer for locale slice
 */
export default localeSlice.reducer;