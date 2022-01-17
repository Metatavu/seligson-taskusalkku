/* eslint-disable react/no-children-prop */
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Config from "../../app/config";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/auth-slice";
import { selectSelectedLanguage, setLanguage } from "../../features/locale/locale-slice";
import { DefaultRoutes, Language, LoginOptions } from "../../types/config";
import HomeNavigator from "../../types/navigators/home";
import RootNavigator from "../../types/navigators/root";
import AuthUtils from "../../utils/auth";
import PinInput from "../generic/pin-input";
import PinCodeAuth from "../../utils/pin-code-auth";
import styles from "../../styles/screens/settings-screen";
import strings from "../../localization/strings";
import TranslationUtils from "../../utils/translations";
import { ScrollView } from "react-native-gesture-handler";
import RadioButtonOptionItem from "../generic/radio-button-option-item";

/**
 * Settings screen component
 */
const SettingsScreen: React.FC = () => {
  const { developmentBuild } = Config.getStatic();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootNavigator.NavigationProps>();

  const selectedLanguage = useAppSelector(selectSelectedLanguage);
  const [ selectedInitialRoute, setSelectedInitialRoute ] = React.useState<keyof HomeNavigator.Routes | undefined>();
  const [ selectedLoginOption, setSelectedLoginOption ] = React.useState<string>();
  const [ pinInputOpen, setPinInputOpen ] = React.useState(false);

  /**
   * Loads initial values when component mounts
   */
  const loadInitialValues = async () => {
    const [ initialRoute, preferredLogin ] = await Promise.all([
      Config.getLocalValue("@initialRoute"),
      Config.getLocalValue("@preferredLogin")
    ]);

    setSelectedInitialRoute(initialRoute);
    setSelectedLoginOption(preferredLogin);
  };

  /**
   * Effect for loading initial values when component mounts
   */
  React.useEffect(() => { loadInitialValues(); }, []);

  /**
   * Event handler for language change
   *
   * @param route selected route
   */
  const onInitialRouteChange = async (route: string) => {
    const homeNavigatorRoute = route as keyof HomeNavigator.Routes;
    await Config.setLocalValue("@initialRoute", homeNavigatorRoute);
    setSelectedInitialRoute(homeNavigatorRoute);
  };

  /**
   * Event handler for login option change
   *
   * @param loginOption selected login option
   */
  const onLoginOptionChange = async (loginOption: LoginOptions) => {
    if (loginOption === LoginOptions.PIN) {
      setPinInputOpen(true);
    }

    await Config.setLocalValue("@preferredLogin", loginOption);
    setSelectedLoginOption(loginOption);
  };

  /**
   * Event handler for language change
   *
   * @param language clicked language
   */
  const onLanguageChange = async (language: Language) => {
    await Config.setLocalValue("@language", language);
    dispatch(setLanguage(language));
  };

  /**
   * Removes local values
   */
  const removeLocalValues = async () => {
    dispatch(logout());
    await Promise.all([
      AuthUtils.removeOfflineToken(),
      Config.removeLocalValue("@language"),
      Config.removeLocalValue("@initialRoute")
    ]);

    navigation.navigate("authentication", { screen: "login" });
  };

  /**
   * Event handler for pin code
   */
  const onSavePinCode = async (pinCode: string) => {
    if (pinCode.length !== 4) {
      return;
    }

    await PinCodeAuth.create(pinCode);
    setPinInputOpen(false);
  };

  /**
   * Renders initial route options
   */
  const renderInitialRouteOptions = () => (
    Object.values(DefaultRoutes).map(route => {
      const localizedOption = TranslationUtils.getDefaultRouteDisplayText(route);

      return (
        <RadioButtonOptionItem
          key={ route }
          label={ localizedOption.title }
          value={ route }
          checked={ selectedInitialRoute?.toString() === route }
          onPress={ onInitialRouteChange }
          description={ localizedOption.description }
        />
      );
    })
  );

  /**
   * Renders login options
   */
  const renderLoginOptions = () => (
    Object.values(LoginOptions).map(option => {
      if (option === LoginOptions.DEMO && !Config.getStatic().developmentBuild) {
        return null;
      }

      const localizedOption = TranslationUtils.getLoginOptionDisplayText(option);

      return (
        <RadioButtonOptionItem
          key={ option }
          label={ localizedOption.title }
          checked={ selectedLoginOption === option }
          value={ option }
          onPress={ onLoginOptionChange }
          description={ localizedOption.description }
        />
      );
    })
  );

  /**
   * Renders language options
   */
  const renderLanguageOptions = () => (
    Object.values(Language).map(language => (
      <RadioButtonOptionItem
        key={ language }
        label={ TranslationUtils.getLanguageDisplayText(language) }
        checked={ selectedLanguage === language }
        value={ language }
        onPress={ onLanguageChange }
      />
    ))
  );

  /**
   * Renders cards
   *
   * @param renderFunction render function to call
   * @param title title
   */
  const renderCards = (renderFunction: () => void, title: string) => (
    <View style={ styles.card }>
      <Text style={ styles.cardTitle }>
        { title }
      </Text>
      { renderFunction() }
    </View>
  );

  /**
   * Renders remove local values button if development environmental variables is set to true.
   * Used only for debugging purposes
   */
  const renderRemoveLocalValues = () => {
    if (developmentBuild) {
      return (
        <View style={{ marginTop: 20 }}>
          <Button onPress={ removeLocalValues }>
            RESET LOCAL VALUES
          </Button>
        </View>
      );
    }

    return null;
  };

  /**
   * Component render
   */
  return (
    <>
      <ScrollView>
        <View style={ styles.container }>
          { renderCards(renderInitialRouteOptions, strings.settingsScreen.initialRoute) }
          { renderCards(renderLoginOptions, strings.settingsScreen.preferredLogin) }
          { renderCards(renderLanguageOptions, strings.settingsScreen.language) }
        </View>
        { renderRemoveLocalValues() }
      </ScrollView>
      <PinInput
        inputOpen={ pinInputOpen }
        onSave={ onSavePinCode }
        onCancel={ () => setPinInputOpen(false) }
      />
    </>
  );
};

export default SettingsScreen;