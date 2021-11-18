import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useAppDispatch } from "../../../app/hooks";
import { authUpdate } from "../../../features/auth/auth-slice";
import strings from "../../../localization/strings";
import AuthNavigator from "../../../types/navigators/auth";
import RootNavigator from "../../../types/navigators/root";
import AuthUtils from "../../../utils/auth";
import { ErrorContext } from "../../error-handler/error-handler";

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
   * Checks offline token
   */
  const checkOfflineToken = async () => {
    const offlineToken = await AuthUtils.retrieveOfflineToken();

    if (offlineToken) {
      try {
        const auth = await AuthUtils.tryToRefresh(offlineToken);
        dispatch(authUpdate(auth));
        navigation.navigate("home");
      } catch (error) {
        errorContext.setError(strings.errorHandling.auth.login, error);
      }
    }
  };

  /**
   * Effect for checking offline token
   */
  React.useEffect(() => { checkOfflineToken(); }, []);

  return (
    <View style={{ marginTop: 200 }}>
      <Button onPress={ () => navigation.navigate("login", {}) }>
        LOGIN
      </Button>
      {/* TODO: Hide demo login access */}
      <Button onPress={ () => navigation.navigate("login", { demoLogin: true }) }>
        DEMO LOGIN
      </Button>
    </View>
  );
};

export default WelcomeScreen;