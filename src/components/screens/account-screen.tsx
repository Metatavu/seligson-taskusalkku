import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button, RadioButton } from "react-native-paper";
import Config from "../../app/config";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/auth-slice";
import { selectSelectedLanguage, setLanguage } from "../../features/locale/locale-slice";
import theme from "../../theme";
import { Language, LoginOptions } from "../../types/config";
import HomeNavigator from "../../types/navigators/home";
import RootNavigator from "../../types/navigators/root";
import AuthUtils from "../../utils/auth";

/**
 * Account screen component
 */
const AccountScreen: React.FC = () => {
  const { developmentBuild } = Config.getStatic();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootNavigator.NavigationProps>();

  const selectedLanguage = useAppSelector(selectSelectedLanguage);
  const [ selectedInitialRoute, setSelectedInitialRoute ] = React.useState<keyof HomeNavigator.Routes | undefined>();
  const [ selectedLoginOption, setSelectedLoginOption ] = React.useState<string>();

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
  const onInitialRouteChange = (route: string) => async () => {
    const homeNavigatorRoute = route as keyof HomeNavigator.Routes;
    await Config.setLocalValue("@initialRoute", homeNavigatorRoute);
    setSelectedInitialRoute(homeNavigatorRoute);
  };

  /**
   * Event handler for login option change
   *
   * @param loginOption selected login option
   */
  const onLoginOptionChange = (loginOption: LoginOptions) => async () => {
    await Config.setLocalValue("@preferredLogin", loginOption);
    setSelectedLoginOption(loginOption);
  };

  /**
   * Event handler for language change
   *
   * @param language clicked language
   */
  const onLanguageChange = (language: Language) => async () => {
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
   * Renders remove local values button if development environmental variables is set to true.
   * Used only for debugging purposes
   */
  const renderRemoveLocalValues = () => {
    if (developmentBuild) {
      return (
        <View>
          <Button onPress={ removeLocalValues }>
            RESET LOCAL VALUES
          </Button>
        </View>
      );
    }
  };

  /**
   * Renders initial route options
   */
  const renderInitialRouteOptions = () => (
    <>
      <RadioButton.Item
        key="portfolio"
        label="portfolio"
        value="portfolio"
        status={ selectedInitialRoute === "portfolio" ? "checked" : "unchecked" }
        color={ theme.colors.primary }
        onPress={ onInitialRouteChange("portfolio") }
      />
      <RadioButton.Item
        key="funds"
        label="funds"
        value="funds"
        status={ selectedInitialRoute === "funds" ? "checked" : "unchecked" }
        color={ theme.colors.primary }
        onPress={ onInitialRouteChange("funds") }
      />
    </>
  );

  /**
   * Renders login options
   */
  const renderLoginOptions = () => (
    Object.values(LoginOptions).map(option => {
      if (option === LoginOptions.DEMO && !Config.getStatic().developmentBuild) {
        return null;
      }

      return (
        <RadioButton.Item
          key={ option }
          label={ option }
          value={ option }
          status={ selectedLoginOption === option ? "checked" : "unchecked" }
          color={ theme.colors.primary }
          onPress={ onLoginOptionChange(option) }
        />
      );
    })
  );

  /**
   * Renders language options
   */
  const renderLanguageOptions = () => {
    return Object.values(Language).map(language => {
      const checked = selectedLanguage === language ? "checked" : "unchecked";

      return (
        <RadioButton.Item
          key={ language }
          label={ language }
          value={ language }
          status={ checked }
          color={ theme.colors.primary }
          onPress={ onLanguageChange(language) }
        />
      );
    });
  };

  /**
   * Component render
   */
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View>
        { renderInitialRouteOptions() }
      </View>
      <View>
        { renderLoginOptions() }
      </View>
      <View>
        { renderLanguageOptions() }
      </View>
      <View style={{ marginTop: 200 }}>
        { renderRemoveLocalValues() }
      </View>
    </View>
  );
};

export default AccountScreen;