import React from "react";
import { useIsFocused } from "@react-navigation/native";
import { Linking, View, Text } from "react-native";
import { Button } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/auth/login-required-screen";
import { SeligsonLogo } from "../../../../assets/seligson-logo";
import { TouchableWithoutFeedback } from "react-native";
import AuthUtils from "../../../utils/auth";
import { useAppDispatch, useAppSelector, useHardwareGoBack, useTimeout } from "../../../app/hooks";
import Config from "../../../app/config";
import { selectAuth, authUpdate } from "../../../features/auth/auth-slice";
import { LoginOptions } from "../../../types/config";
import BiometricAuth from "../../../utils/biometric-auth";
import { ErrorContext } from "../../error-handler/error-handler";
import PinInput from "../../generic/pin-input";
import PinCodeAuth from "../../../utils/pin-code-auth";
import KeycloakLoginScreen from "./keycloak-login-screen";

/**
 * Login required screen component
 *
 * @param props component properties
 */
const LoginRequiredScreen: React.FC = () => {
  useHardwareGoBack();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const errorContext = React.useContext(ErrorContext);
  const focus = useIsFocused();

  const [ keycloakLoginOpen, setKeycloakLoginOpen ] = React.useState(false);
  const [ demoLogin, setDemoLogin ] = React.useState(false);
  const [ loginMethod, setLoginMethod ] = React.useState<LoginOptions>();
  const [ pinInputOpen, setPinInputOpen ] = React.useState(false);
  const [ pinError, setPinError ] = React.useState(false);
  const [ authError, setAuthError ] = React.useState(false);
  const [ counter, setCounter ] = React.useState(0);
  const { setTimer, clearTimer } = useTimeout();

  /**
   * Refreshes authentication using offline token
   */
  const refreshAuthWithOfflineToken = async () => {
    const offlineToken = await AuthUtils.retrieveOfflineToken();

    if (!offlineToken) {
      throw new Error("No offline token");
    }

    const refreshedAuth = await AuthUtils.tryToRefresh(offlineToken);
    dispatch(authUpdate(refreshedAuth));
  };

  /**
   * Handles local authentication if user has selected biometric, pin code or demo as preferred login method
   *
   * @param method login method
   */
  const handleLocalAuthentication = async (method: LoginOptions) => {
    if (authError) {
      return;
    }

    if (!await AuthUtils.retrieveOfflineToken()) {
      setLoginMethod(LoginOptions.USERNAME_AND_PASSWORD);
      return;
    }

    if (method === LoginOptions.BIOMETRIC) {
      try {
        const result = await BiometricAuth.authenticate();
        if (result) {
          try {
            await refreshAuthWithOfflineToken();
          } catch {
            setLoginMethod(LoginOptions.USERNAME_AND_PASSWORD);
          }
          return;
        }

        setAuthError(true);
        return;
      } catch (error) {
        errorContext.setError(strings.errorHandling.auth.biometric, error);
        return;
      }
    }

    if (method === LoginOptions.PIN) {
      setPinInputOpen(true);
      return;
    }

    if (method === LoginOptions.DEMO) {
      setAuthError(false);
      setKeycloakLoginOpen(true);
    }
  };

  /**
   * Initializes app authentication
   */
  const initialize = async () => {
    const preferredLoginMethod = await Config.getLocalValue("@preferredLogin");

    if (!preferredLoginMethod) {
      await Config.setLocalValue("@preferredLogin", LoginOptions.USERNAME_AND_PASSWORD);
    }

    setLoginMethod(preferredLoginMethod ?? LoginOptions.USERNAME_AND_PASSWORD);
    setAuthError(false);
    setKeycloakLoginOpen(false);
  };

  /**
   * Event handler for hidden login trigger press
   */
  const onHiddenLoginTriggerPress = () => {
    const updatedCounter = counter + 1;

    if (updatedCounter < 10) {
      setCounter(updatedCounter);
      setTimer(() => setCounter(0));
      return;
    }

    clearTimer();
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
          await refreshAuthWithOfflineToken();
        } catch {
          setLoginMethod(LoginOptions.USERNAME_AND_PASSWORD);
        }
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
   * Effect for checking if user has set language
   */
  React.useEffect(() => {
    focus && initialize();
  }, [ focus ]);

  /**
   * Effect for handling local authentication methods if such has been chosen as preferred method
   */
  React.useEffect(() => {
    const remoteLoginMethods = [
      LoginOptions.USERNAME_AND_PASSWORD,
      LoginOptions.STRONG_AUTH
    ];

    if (!loginMethod || remoteLoginMethods.includes(loginMethod)) {
      return;
    }

    handleLocalAuthentication(loginMethod);
  }, [ authError, auth, loginMethod ]);

  /**
   * Renders keycloak login
   */
  const renderKeycloakLogin = () => (
    <View style={ styles.loginScreen }>
      <View style={ styles.cardWrapper }>
        <View style={ styles.cardContent }>
          <TouchableWithoutFeedback onPress={ onHiddenLoginTriggerPress }>
            <View>
              <SeligsonLogo/>
            </View>
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
    if (
      (authError && loginMethod !== LoginOptions.PIN) ||
      keycloakLoginOpen
    ) {
      return null;
    }

    switch (loginMethod) {
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
   * Renders auth error
   */
  const renderAuthError = () => (
    <View style={ styles.loginScreen }>
      <Button
        uppercase={ false }
        onPress={ () => setAuthError(false) }
        style={ styles.errorButton }
        color="white"
      >
        { strings.auth.tryAgain }
      </Button>
      <Button
        uppercase={ false }
        onPress={ () => {
          setLoginMethod(LoginOptions.USERNAME_AND_PASSWORD);
          setKeycloakLoginOpen(true);
          setAuthError(false);
        }}
        style={ styles.errorButton }
        color="white"
      >
        { strings.auth.loginRequired }
      </Button>
    </View>
  );

  /**
   * Component render
   */
  return (
    <View style={{ width: "100%", height: "100%" }}>
      { keycloakLoginOpen &&
        <KeycloakLoginScreen
          strongAuth={ loginMethod === LoginOptions.STRONG_AUTH }
          demoLogin={ demoLogin }
        />
      }
      { authError && renderAuthError() }
      { renderContent() }
    </View>
  );
};

export default LoginRequiredScreen;