import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { Authentication } from "../../types";
import AuthUtils from "../../utils/auth";

/**
 * Interface describing auth state in Redux
 */
export interface AuthState {
  authReady: boolean;
  auth?: Authentication;
  anonymousAuth?: Authentication;
}

/**
 * Initial auth state
 */
const initialState: AuthState = {
  authReady: false,
  auth: undefined,
  anonymousAuth: undefined
};

/**
 * Auth slice of Redux store
 */
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    authReadyUpdate: (state, { payload }: PayloadAction<boolean>) => {
      state.authReady = payload;
    },
    authUpdate: (state, { payload }: PayloadAction<Authentication | undefined>) => {
      const auth = payload;
      auth && AuthUtils.saveOfflineToken(auth.refreshToken);
      state.auth = auth;
    },
    anonymousAuthUpdate: (state, { payload }: PayloadAction<Authentication | undefined>) => {
      state.anonymousAuth = payload;
    },
    logout: state => {
      AuthUtils.removeOfflineToken();
      state.auth = undefined;
      state.authReady = false;
    }
  }
});

/**
 * Auth actions from created auth slice
 */
export const { authReadyUpdate, authUpdate, anonymousAuthUpdate, logout } = authSlice.actions;

/**
 * Select authReady selector, used with useAppSelector custom hook defined for Redux store
 *
 * @param state Redux store root state
 * @returns authReady from Redux store
 */
export const selectAuthReady = (state: RootState) => state.auth.authReady;

/**
 * Select authentication selector, used with useAppSelector custom hook defined for Redux store
 *
 * @param state Redux store root state
 * @returns authentication from Redux store
 */
export const selectAuth = (state: RootState) => state.auth.auth;

/**
 * Select authentication selector, used with useAppSelector custom hook defined for Redux store
 *
 * @param state Redux store root state
 * @returns authentication from Redux store
 */
export const selectAnonymousAuth = (state: RootState) => state.auth.anonymousAuth;

/**
 * Reducer for auth slice
 */
export default authSlice.reducer;