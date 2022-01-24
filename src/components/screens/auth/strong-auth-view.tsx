/* eslint-disable no-console */
import React from "react";
import { Platform, View } from "react-native";
import WebView from "react-native-webview";
import { WebViewErrorEvent, WebViewNavigationEvent } from "react-native-webview/lib/WebViewTypes";
import Config from "../../../app/config";
import * as AuthSession from "expo-auth-session";
import { useAppDispatch } from "../../../app/hooks";
import { authUpdate } from "../../../features/auth/auth-slice";
import AuthUtils from "../../../utils/auth";
import { URL } from "react-native-url-polyfill";
import { useNavigation, useRoute } from "@react-navigation/native";
import RootNavigator from "../../../types/navigators/root";
import AuthNavigator from "../../../types/navigators/auth";
import { Button } from "react-native-paper";
import strings from "../../../localization/strings";
import { LoginOptions } from "../../../types/config";

/**
 * Strong authentication view component
 *
 * @param props component properties
 */
const StrongAuthView: React.FC = () => {
  const navigation = useNavigation<RootNavigator.NavigationProps>();
  const { params } = useRoute<AuthNavigator.RouteProps>();
  const demoLogin = params?.demoLogin;
  const strongAuth = params?.strongAuth;

  const dispatch = useAppDispatch();
  const { auth, demoLoginUrl } = Config.getStatic();
  const discovery = AuthSession.useAutoDiscovery(auth.issuer);
  const [ authUrl, setAuthUrl ] = React.useState<string>();

  /**
   * Effect that initializes strong authentication flow
   */
  React.useEffect(() => {
    if (!auth.scopes || !auth.redirectUrl || !auth.serviceConfiguration) {
      return;
    }

    if (demoLogin) {
      setAuthUrl(demoLoginUrl);
      return;
    }

    const url = new URL(`${auth.serviceConfiguration.authorizationEndpoint}`);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", auth.clientId);
    url.searchParams.append("scope", auth.scopes.join(" "));
    url.searchParams.append("redirect_uri", auth.redirectUrl);
    url.searchParams.append("kc_idp_hint", strongAuth ? "telia" : "taskusalkku");

    setAuthUrl(url.href);
  }, []);

  /**
   * Exchanges OAuth code to access token
   *
   * @param code OAuth code
   */
  const exchangeCode = async (code: string) => {
    if (!discovery) {
      return;
    }

    try {
      const result = await AuthSession.exchangeCodeAsync({
        clientId: auth.clientId,
        redirectUri: auth.redirectUrl || "",
        code: code,
        scopes: auth.scopes
      }, discovery);

      if (!result?.accessToken || !result?.refreshToken) {
        throw new Error("Login failed");
      }

      const authentication = AuthUtils.createAuthFromExpoTokenResponse(result);
      dispatch(authUpdate(authentication));

      !await Config.getLocalValue("@initialRoute") && await Config.setLocalValue("@initialRoute", "portfolio");
      !await Config.getLocalValue("@preferredLogin") && await Config.setLocalValue("@preferredLogin", LoginOptions.USERNAME_AND_PASSWORD);

      navigation.replace("home");
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Parser for OAuth code
   *
   * @param event web view navigation event
   */
  const oauthCodeParser = ({ nativeEvent: { url } }: WebViewNavigationEvent | WebViewErrorEvent) => {
    if (!auth.redirectUrl || !url.startsWith(auth.redirectUrl)) {
      return;
    }

    const code = new URL(url).searchParams.get("code");
    code && exchangeCode(code);
  };

  if (!authUrl) {
    return null;
  }

  /**
   * Component render
   */
  return (
    <View style={{ flex: 1, marginTop: 40 }}>
      {/* TODO: Fix styling */}
      { Platform.OS === "ios" &&
        <Button onPress={ navigation.goBack }>
          { strings.generic.back }
        </Button>
      }
      <WebView
        incognito
        style={{ height: "100%" }}
        source={{ uri: authUrl }}
        onLoadEnd={ oauthCodeParser }
      />
    </View>
  );
};

export default StrongAuthView;