import React from "react";
import { useIsFocused } from "@react-navigation/native";
import { Linking, View, Text } from "react-native";
import { Button } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/auth/login-required-screen";
import SeligsonLogo from "../../../../assets/seligson-logo";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AuthUtils from "../../../utils/auth";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Config from "../../../app/config";
import { selectAuth, authUpdate } from "../../../features/auth/auth-slice";
import { LoginOptions } from "../../../types/config";
import BiometricAuth from "../../../utils/biometric-auth";
import { ErrorContext } from "../../error-handler/error-handler";
import PinInput from "../../generic/pin-input";
import PinCodeAuth from "../../../utils/pin-code-auth";
import KeycloakLoginScreen from "./keycloak-login-screen";

/**
 * Component properties
 */
interface Props {
  setAuthReady: (ready: boolean) => void;
}

/**
 * Login required screen component
 */
const LoginRequiredScreen: React.FC<Props> = ({ setAuthReady }) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const errorContext = React.useContext(ErrorContext);
  const focus = useIsFocused();

  const [ keycloakLoginOpen, setKeycloakLoginOpen ] = React.useState(false);
  const [ demoLogin, setDemoLogin ] = React.useState(false);
  const [ loginOption, setLoginOption ] = React.useState<LoginOptions>();
  const [ pinInputOpen, setPinInputOpen ] = React.useState(false);
  const [ pinError, setPinError ] = React.useState(false);
  const [ authError, setAuthError ] = React.useState(false);
  const [ counter, setCounter ] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout>();

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
   * Checks other login options if user has selected biometric, pin code or demo
   * as preferred login option.
   */
  const checkOtherLoginOptions = async () => {
    if (authError) {
      return;
    }

    const offlineToken = await AuthUtils.retrieveOfflineToken();

    if (!offlineToken) {
      setLoginOption(LoginOptions.USERNAME_AND_PASSWORD);
      return;
    }

    if (loginOption === LoginOptions.BIOMETRIC) {
      try {
        const result = await BiometricAuth.authenticate();
        if (result) {
          try {
            await checkOfflineToken();
          } catch {
            setLoginOption(LoginOptions.USERNAME_AND_PASSWORD);
          }
          setAuthReady(true);
          return;
        }

        setAuthError(true);
        return;
      } catch (error) {
        errorContext.setError(strings.errorHandling.auth.biometric, error);
        return;
      }
    }

    if (loginOption === LoginOptions.PIN) {
      setPinInputOpen(true);
      return;
    }

    if (loginOption === LoginOptions.DEMO) {
      setAuthError(false);
      setKeycloakLoginOpen(true);
    }
  };

  /**
   * Initializes app data
   */
  const initialize = async () => {
    setLoginOption(await Config.getLocalValue("@preferredLogin"));
    setAuthError(false);
    setKeycloakLoginOpen(false);
  };

  /**
   * Effect for checking if user has set language
   */
  React.useEffect(() => {
    if (focus) {
      initialize();
    }
  }, [ focus ]);

  /**
   * Effect for resolving navigation path when auth error value or authentication changes.
   * auth dependency is needed because offline login doesn't update the auth
   * fast enough in every case if login option is set to other than username and password
   * or strong authentication.
   */
  React.useEffect(() => { checkOtherLoginOptions(); }, [ authError, auth, loginOption ]);

  /**
   * Sets timer by resetting possible previous one and setting new one
   *
   * @param callback callback
   */
  const setTimer = (callback: (() => any) | undefined) => {
    timer.current && clearTimeout(timer.current);
    timer.current = callback ? setTimeout(callback, 1000) : undefined;
  };

  /**
   * Login counter
   */
  const handlePress = () => {
    const updatedCounter = counter + 1;

    if (updatedCounter < 10) {
      setCounter(updatedCounter);
      setTimer(() => setCounter(0));
      return;
    }

    setKeycloakLoginOpen(true);
    setDemoLogin(true);
  };

  /**
   * Event handler for validating pin code user has given
   *
   * @param pinCode pin code to validate
   */
  const onValidatePinCode = async (pinCode: string) => {
    try {
      const result = await PinCodeAuth.authenticate(pinCode);
      if (result) {
        try {
          await checkOfflineToken();
        } catch {
          setLoginOption(LoginOptions.USERNAME_AND_PASSWORD);
        }
        setAuthReady(true);
        return;
      }

      setPinError(true);
      setAuthError(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * Renders keycloak login
   */
  const renderKeycloakLogin = () => (
    <View>
      <View style={ styles.cardWrapper }>
        <View style={ styles.cardContent }>
          <TouchableWithoutFeedback onPress={ handlePress }>
            <SeligsonLogo/>
          </TouchableWithoutFeedback>
          <Text style={ styles.titleText }>
            { strings.auth.loginRequired }
          </Text>
          <Button
            onPress={ () => {
              setKeycloakLoginOpen(true);
              setDemoLogin(false);
            }}
            style={ styles.loginButton }
            labelStyle={{ color: "#fff" }}
          >
            { strings.generic.login }
          </Button>
          <Text style={{ textAlign: "center" }}>
            { strings.auth.newAccount }
          </Text>
          <Text
            onPress={ () => Linking.openURL("https://www.seligson.fi/sco/suomi/asiointi/omasalkku/") }
            style={ styles.linkText }
          >
            { strings.generic.webPage }
          </Text>
        </View>
      </View>
    </View>
  );

  /**
   * Renders pin input
   */
  const renderPinInput = () => (
    <PinInput
      inputOpen={ pinInputOpen }
      onSave={ onValidatePinCode }
      onCancel={ () => {
        setPinInputOpen(false);
        setAuthError(true);
      }}
      error={ pinError }
      confirmButtonLabel={ strings.generic.login }
    />
  );

  /**
   * Renders content
   */
  const renderContent = () => {
    if (keycloakLoginOpen) {
      return null;
    }

    switch (loginOption) {
      case LoginOptions.USERNAME_AND_PASSWORD:
      case LoginOptions.STRONG_AUTH:
        return renderKeycloakLogin();
      case LoginOptions.PIN:
        return renderPinInput();
      default:
        return null;
    }
  };

  /**
   * Component render
   */
  return (
    <View style={{ width: "100%", height: "100%" }}>
      { renderContent() }
      { keycloakLoginOpen &&
        <KeycloakLoginScreen
          onAuthSuccess={ () => setAuthReady(true) }
          strongAuth={ loginOption === LoginOptions.STRONG_AUTH }
          demoLogin={ demoLogin }
        />
      }
      { authError &&
        <>
          <Button
            uppercase={ false }
            onPress={ () => setAuthError(false) }
          >
            { strings.auth.tryAgain }
          </Button>
          <Button
            uppercase={ false }
            onPress={ () => {
              setKeycloakLoginOpen(true);
              setAuthError(false);
            }}
          >
            { strings.auth.loginRequired }
          </Button>
        </>
      }
    </View>
  );
};

export default LoginRequiredScreen;