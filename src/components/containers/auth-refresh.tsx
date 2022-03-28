/* eslint-disable no-console */
import React from "react";
import { anonymousAuthUpdate, authUpdate, selectAnonymousAuth, selectAuth } from "../../features/auth/auth-slice";
import { AppState, AppStateStatus, Alert, View } from "react-native";
import AuthUtils from "../../utils/auth";
import strings from "../../localization/strings";
import { useAppDispatch, useAppSelector, useInterval } from "../../app/hooks";
import Config from "../../app/config";
import WebView from "react-native-webview";

/**
 * Component properties
 */
interface Props {
  onLoginFail?: () => void;
}

/**
 * Component for keeping authentication token fresh
 *
 * @param props component properties
 */
const AuthRefresh: React.FC<Props> = ({ onLoginFail }) => {
  const anonymousAuth = useAppSelector(selectAnonymousAuth);
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const [ appState, setAppState ] = React.useState<AppStateStatus>(AppState.currentState);
  const [ previousSessionRevoked, setPreviousSessionRevoked ] = React.useState(false);

  /**
   * Event handler for token refreshing failure
   */
  const onTokenRefreshFailure = () => {
    dispatch(authUpdate(undefined));
    onLoginFail?.();
  };

  /**
   * Displays authentication expired alert to user
   */
  const displayAuthExpiredAlert = () => {
    Alert.alert(
      strings.auth.loginSessionExpiredTitle,
      strings.auth.loginSessionExpiredContent,
      [{ text: "OK", onPress: onTokenRefreshFailure }]
    );
  };

  /**
   * Refresh anonymous user access token
   */
  const refreshAnonymousAuth = async () => {
    try {
      if (anonymousAuth && AuthUtils.needsRefresh(anonymousAuth)) {
        const refreshedToken = await AuthUtils.tryToRefresh(anonymousAuth.refreshToken, anonymousAuth);
        dispatch(anonymousAuthUpdate(refreshedToken));
      }

      return;
    } catch {
      console.warn("Failed to refresh anonymous access token, trying to log in again");
    }

    try {
      const refreshedToken = await AuthUtils.anonymousLogin();
      dispatch(anonymousAuthUpdate(refreshedToken));
    } catch {
      console.error("Failed to refresh anonymous access token");
    }
  };

  /**
   * Refresh logged in user access token
   */
  const refreshAuth = async () => {
    try {
      if (auth && AuthUtils.needsRefresh(auth)) {
        const refreshedToken = await AuthUtils.tryToRefresh(auth.refreshToken, auth);
        dispatch(authUpdate(refreshedToken));
      }

      return;
    } catch (error) {
      console.warn("Failed to refresh access token, trying to login again with offline token.");
    }

    try {
      const offlineToken = await AuthUtils.retrieveOfflineToken();

      if (!offlineToken) {
        throw new Error("Offline token not found");
      }

      const refreshedToken = await AuthUtils.tryToRefresh(offlineToken);
      dispatch(authUpdate(refreshedToken));
    } catch {
      displayAuthExpiredAlert();
    }
  };

  /**
   * App state change listener
   *
   * @param nextAppState next app state
   */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      refreshAnonymousAuth();
      refreshAuth();
    }

    setAppState(nextAppState);
  };

  /**
   * Interval for refreshing authentication
   */
  useInterval(() => {
    refreshAnonymousAuth();
    refreshAuth();
  }, 20 * 1000);

  /**
   * Adds and cleans up app state change listener
   */
  React.useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => AppState.removeEventListener("change", handleAppStateChange);
  }, []);

  if (!previousSessionRevoked) {
    return (
      <View style={{ height: 0 }}>
        <WebView
          source={{ uri: Config.getStatic().authLogoutEndpoint }}
          onLoadEnd={ () => setPreviousSessionRevoked(true) }
        />
      </View>
    );
  }

  return null;
};

export default AuthRefresh;