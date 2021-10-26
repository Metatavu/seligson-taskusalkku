import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { Authentication } from "../../types";
import AuthUtils from "../../utils/auth-utils";

/**
 * Interface describing auth state in Redux
 */
export interface AuthState {
  auth?: Authentication;
}

/**
 * Initial auth state
 */
const initialState: AuthState = {
  auth: undefined
};

/**
 * Auth slice of Redux store
 */
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    authUpdate: (state, action: PayloadAction<Authentication | undefined>) => {
      const auth = action?.payload;
      auth && AuthUtils.saveOfflineToken(auth.refreshToken);
      state.auth = auth;
    },
    logout: state => {
      AuthUtils.removeOfflineToken();
      state.auth = undefined;
    }
  }
});

/**
 * Auth actions from created auth slice
 */
export const { authUpdate, logout } = authSlice.actions;

/**
 * Select authentication selector, used with useAppSelector custom hook defined for Redux store
 *
 * @param state Redux store root state
 * @returns authentication from Redux store
 */
export const selectAuth = (state: RootState) => state.auth.auth;

/**
 * Reducer for auth slice
 */
export default authSlice.reducer;