import React from "react";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../../app/hooks";
import { anonymousAuthUpdate } from "../../../features/auth/auth-slice";
import AuthNavigator from "../../../types/navigators/auth";
import RootNavigator from "../../../types/navigators/root";
import AuthUtils from "../../../utils/auth";
import Config from "../../../app/config";
import { View } from "react-native";
import { SeligsonLogo } from "../../../../assets/seligson-logo";
import theme from "../../../theme";
import { ProgressBar } from "react-native-paper";
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
  const errorContext = React.useContext(ErrorContext);

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
   * Initializes app data
   */
  const initialize = async () => {
    await anonymousLogin();
    const initialRoute = await Config.getLocalValue("@initialRoute");
    navigation.replace("home", { screen: (initialRoute || "portfolio") as keyof HomeNavigator.Routes });
  };

  /**
   * Effect for checking if user has set language
   */
  React.useEffect(() => { initialize(); }, []);

  /**
   * Component render
   */
  return (
    <View style={ styles.container }>
      <SeligsonLogo/>
      <View style={ styles.progressContainer }>
        <ProgressBar indeterminate color={ theme.colors.primary }/>
      </View>
    </View>
  );
};

export default WelcomeScreen;