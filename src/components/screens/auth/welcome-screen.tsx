import React from "react";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../../app/hooks";
import { anonymousAuthUpdate, authUpdate } from "../../../features/auth/auth-slice";
import strings from "../../../localization/strings";
import AuthNavigator from "../../../types/navigators/auth";
import RootNavigator from "../../../types/navigators/root";
import AuthUtils from "../../../utils/auth";
import { ErrorContext } from "../../error-handler/error-handler";
import Config from "../../../app/config";
import { Language, LoginOptions } from "../../../types/config";
import { setLanguage } from "../../../features/locale/locale-slice";
import { View } from "react-native";
import SeligsonLogo from "../../../../assets/seligsonLogo";
import theme from "../../../theme";
import { ProgressBar } from "react-native-paper";
import BiometricAuth from "../../../utils/biometric-auth";
import PinCodeAuth from "../../../utils/pin-code-auth";

/**
 * Custom navigation prop type for WelcomeScreen. Consists of AuthNavigator and RootNavigator
 */
type WelcomeScreenNavigationProp = CompositeNavigationProp<AuthNavigator.NavigationProps<"welcome">, RootNavigator.NavigationProps>;

/**
 * Welcome screen component
 */
const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const errorContext = React.useContext(ErrorContext);

  /**
   * Performs anonymous login
   */
  const anonymousLogin = async () => {
    try {
      const auth = await AuthUtils.anonymousLogin();
      auth && dispatch(anonymousAuthUpdate(auth));
    } catch (error) {
      errorContext.setError(strings.errorHandling.auth.login, error);
    }
  };

  /**
   * Checks offline token
   */
  const checkOfflineToken = async () => {
    const offlineToken = await AuthUtils.retrieveOfflineToken();

    if (!offlineToken) {
      throw new Error("No offline token");
    }

    const auth = await AuthUtils.tryToRefresh(offlineToken);
    dispatch(authUpdate(auth));
  };

  /**
   * Checks login flow based on the local storage value
   */
  const checkLoginFlow = async () => {
    const preferredLogin = await Config.getLocalValue("@preferredLogin");

    navigation.replace("home");

    if (!preferredLogin || preferredLogin === LoginOptions.USERNAME_AND_PASSWORD) {
      navigation.replace("login");
      return;
    }

    try {
      checkOfflineToken();
    } catch {
      navigation.replace("login");
      return;
    }

    if (preferredLogin === LoginOptions.BIOMETRIC) {
      try {
        const result = await BiometricAuth.authenticate();
        if (result) {
          navigation.replace("home");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (preferredLogin === LoginOptions.PIN) {
      try {
        await PinCodeAuth.create("1234");
        const result = await PinCodeAuth.authenticate("1234");
        if (result) {
          navigation.replace("home");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (preferredLogin === LoginOptions.DEMO) {
      navigation.replace("authentication", { screen: "login", params: { demoLogin: true } });
      return;
    }

    navigation.replace("home");
  };

  /**
   * Initializes app data
   */
  const initialize = async () => {
    await anonymousLogin();
    await checkLoginFlow();
    dispatch(setLanguage(await Config.getLocalValue("@language") || Language.FI));

    !await Config.getLocalValue("@initialRoute") && await Config.setLocalValue("@initialRoute", "portfolio");
    // navigation.replace("home");
  };

  /**
   * Effect for checking offline token
   */
  React.useEffect(() => { initialize(); }, []);

  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <SeligsonLogo/>
      <View style={{ width: "50%", marginTop: 50 }}>
        <ProgressBar indeterminate color={ theme.colors.primary }/>
      </View>
    </View>
  );
};

export default WelcomeScreen;