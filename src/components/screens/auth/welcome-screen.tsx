import React from "react";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { anonymousAuthUpdate, authUpdate, selectAuth } from "../../../features/auth/auth-slice";
import AuthNavigator from "../../../types/navigators/auth";
import RootNavigator from "../../../types/navigators/root";
import AuthUtils from "../../../utils/auth";
import Config from "../../../app/config";
import { Language, LoginOptions } from "../../../types/config";
import { setLanguage } from "../../../features/locale/locale-slice";
import { View } from "react-native";
import SeligsonLogo from "../../../../assets/seligson-logo";
import theme from "../../../theme";
import { Button, ProgressBar } from "react-native-paper";
import BiometricAuth from "../../../utils/biometric-auth";
import PinCodeAuth from "../../../utils/pin-code-auth";
import PinInput from "../../generic/pin-input";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/auth/welcome-screen";
import HomeNavigator from "../../../types/navigators/home";
import { ErrorContext } from "../../error-handler/error-handler";

/**
 * Custom navigation prop type for WelcomeScreen. Consists of AuthNavigator and RootNavigator
 */
type WelcomeScreenNavigationProp = CompositeNavigationProp<RootNavigator.NavigationProps, AuthNavigator.NavigationProps<"welcome">>;

/**
 * Welcome screen component
 */
const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const errorContext = React.useContext(ErrorContext);

  const [ pinInputOpen, setPinInputOpen ] = React.useState(false);
  const [ pinError, setPinError ] = React.useState(false);
  const [ authError, setAuthError ] = React.useState(false);

  /**
   * Performs anonymous login
   */
  const anonymousLogin = async () => {
    try {
      const anonymousAuth = await AuthUtils.anonymousLogin();
      dispatch(anonymousAuthUpdate(anonymousAuth));
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

    const refreshedAuth = await AuthUtils.tryToRefresh(offlineToken);
    dispatch(authUpdate(refreshedAuth));
  };

  /**
   * Resolves navigation path
   */
  const resolveNavigationPath = async () => {
    if (authError) {
      return;
    }

    const preferredLogin = await Config.getLocalValue("@preferredLogin");
    const initialRoute = await Config.getLocalValue("@initialRoute");

    if (!preferredLogin || preferredLogin === LoginOptions.USERNAME_AND_PASSWORD) {
      navigation.replace("login");
      return;
    }

    if (preferredLogin === LoginOptions.STRONG_AUTH) {
      navigation.navigate("login", { strongAuth: true });
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
          navigation.replace(
            "home", {
              screen: auth ? initialRoute as keyof HomeNavigator.Routes : "funds"
            }
          );
          return;
        }

        setAuthError(true);
        return;
      } catch (error) {
        errorContext.setError(strings.errorHandling.auth.biometric, error);
        return;
      }
    }

    if (preferredLogin === LoginOptions.PIN) {
      setPinInputOpen(true);
      return;
    }

    if (preferredLogin === LoginOptions.DEMO) {
      navigation.replace("authentication", { screen: "login", params: { demoLogin: true } });
      return;
    }

    navigation.replace("home", { screen: "funds" });
  };

  /**
   * Initializes app data
   */
  const initialize = async () => {
    await anonymousLogin();
    dispatch(setLanguage(await Config.getLocalValue("@language") || Language.FI));
    !await Config.getLocalValue("@initialRoute") && await Config.setLocalValue("@initialRoute", "portfolio");
    await resolveNavigationPath();
  };

  /**
   * Effect for checking offline token
   */
  React.useEffect(() => { initialize(); }, []);

  /**
   * Effect for resolving navigation path when auth error value changes
   */
  React.useEffect(() => { resolveNavigationPath(); }, [ authError ]);

  /**
   * Event handler for validating pin code user has given
   *
   * @param pinCode pin code to validate
   */
  const onValidatePinCode = async (pinCode: string) => {
    try {
      const result = await PinCodeAuth.authenticate(pinCode);
      if (result) {
        navigation.replace("home");
        return;
      }

      setPinError(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={ styles.container }>
      <SeligsonLogo/>
      <View style={ styles.progressContainer }>
        <ProgressBar indeterminate color={ theme.colors.primary }/>
      </View>
      <PinInput
        inputOpen={ pinInputOpen }
        onSave={ onValidatePinCode }
        onCancel={ () => setPinInputOpen(false) }
        error={ pinError }
        confirmButtonLabel={ strings.generic.login }
      />
      { authError &&
        <Button
          uppercase={ false }
          onPress={ () => setAuthError(false) }
        >
          { strings.auth.login }
        </Button>
      }
    </View>
  );
};

export default WelcomeScreen;