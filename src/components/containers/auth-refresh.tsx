import React from "react";

import { anonymousAuthUpdate, authUpdate, selectAnonymousAuth, selectAuth } from "../../features/auth/auth-slice";
import { AppState, AppStateStatus, Alert, View } from "react-native";
import AuthUtils from "../../utils/auth";
import strings from "../../localization/strings";
import { useAppDispatch, useAppSelector, useInterval } from "../../app/hooks";
import Config from "../../app/config";
import WebView from "react-native-webview";

/**
 * Interface describing component properties
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
  const auth = useAppSelector(selectAuth);
  const anonymousAuth = useAppSelector(selectAnonymousAuth);
  const dispatch = useAppDispatch();
  const [ appState, setAppState ] = React.useState<AppStateStatus>(AppState.currentState);
  const [ previousSessionRevoked, setPreviousSessionRevoked ] = React.useState(false);

  /**
   * Handles logging in again in case token refreshing fails
   */
  const handleTokenRefreshFailure = () => {
    dispatch(authUpdate(undefined));
    onLoginFail && onLoginFail();
  };

  /**
   * Displays authentication expired alert to user
   */
  const showAuthExpiredAlert = () => {
    Alert.alert(
      strings.auth.loginSessionExpiredTitle,
      strings.auth.loginSessionExpiredContent,
      [{ text: "OK", onPress: handleTokenRefreshFailure }]
    );
  };

  /**
   * Refresh anonymous authentication
   */
  const refreshAnonymousAuth = async () => {
    try {
      if (!anonymousAuth || !AuthUtils.needsRefresh(anonymousAuth)) {
        return;
      }

      dispatch(anonymousAuthUpdate(await AuthUtils.tryToRefresh(anonymousAuth.refreshToken)));
    } catch (e) {
      showAuthExpiredAlert();
    }
  };

  /**
   * Refresh authentication
   */
  const refreshAuth = async () => {
    try {
      if (!auth || !AuthUtils.needsRefresh(auth)) {
        return;
      }

      dispatch(authUpdate(await AuthUtils.tryToRefresh(auth.refreshToken)));
    } catch (e) {
      showAuthExpiredAlert();
    }
  };

  /**
   * App state change listener
   *
   * @param nextAppState next app state
   */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      await refreshAuth();
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