import React from "react";
import { View } from "react-native";
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

/**
 * Strong authentication view
 *
 * @param props component properties
 */
const StrongAuthView: React.FC = () => {
  const navigation = useNavigation<RootNavigator.NavigationProps<"home">>();
  const { params } = useRoute<AuthNavigator.RouteProps>();
  const demoLogin = params?.demoLogin;

  const dispatch = useAppDispatch();
  const { auth } = Config.getStatic();
  const discovery = AuthSession.useAutoDiscovery(auth.issuer);
  const [ authUrl, setAuthUrl ] = React.useState<string>();

  /**
   * Effect that initializes strong authentication flow
   */
  React.useEffect(() => {
    if (!auth.scopes || !auth.redirectUrl || !auth.serviceConfiguration) {
      return;
    }

    const url = new URL(`${auth.serviceConfiguration.authorizationEndpoint}`);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", auth.clientId);
    url.searchParams.append("scope", auth.scopes.join(" "));
    url.searchParams.append("redirect_uri", auth.redirectUrl);
    url.searchParams.append("kc_idp_hint", "taskusalkku");

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
        clientId: "app",
        redirectUri: Config.getStatic().auth.redirectUrl || "",
        code: code,
        scopes: [ "openid", "profile", "offline_access" ]
      }, discovery);

      if (result?.accessToken) {
        dispatch(authUpdate(AuthUtils.createAuth(result)));
        navigation.reset({ routes: [{ name: "home" }] });
      } else {
        throw new Error("Login failed");
      }
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
      <WebView
        incognito
        style={{ height: "100%" }}
        source={{ uri: demoLogin ? Config.getStatic().demoLoginUrl : authUrl }}
        onLoadEnd={ oauthCodeParser }
      />
    </View>
  );
};

export default StrongAuthView;