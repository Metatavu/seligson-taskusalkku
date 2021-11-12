import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import AuthNavigator from "../../../types/navigators/auth";
import RootNavigator from "../../../types/navigators/root";
import AuthUtils from "../../../utils/auth";

/**
 * Custom navigation prop type for WelcomeScreen. Consists of AuthNavigator and RootNavigator
 */
type WelcomeScreenNavigationProp = CompositeNavigationProp<AuthNavigator.NavigationProps<"welcome">, RootNavigator.NavigationProps>;

/**
 * Welcome screen component
 */
const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  /**
   * Checks offline token
   */
  const checkOfflineToken = async () => {
    const offlineToken = await AuthUtils.retrieveOfflineToken();

    if (offlineToken) {
      navigation.navigate("home");
    }
  };

  /**
   * Effect for checking offline token
   */
  React.useEffect(() => { checkOfflineToken(); }, []);

  return (
    <View style={{ marginTop: 200 }}>
      <Button onPress={ () => navigation.navigate("login") }>
        LOGIN
      </Button>
    </View>
  );
};

export default WelcomeScreen;