import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Linking, View } from "react-native";
import { Button, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import theme from "../../../theme";
import RootNavigator from "../../../types/navigators/root";

/**
 * Login required screen component
 *
 * TODO: Fix styling
 */
const LoginRequiredScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigator.NavigationProps>();

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View>
        <Text style={{ textAlign: "center", padding: theme.spacing(3) }}>
          { strings.auth.loginRequired }
        </Text>
      </View>
      <Button onPress={ () => navigation.navigate("authentication", { screen: "login" }) }>
        { strings.generic.login }
      </Button>
      <Button onPress={ () => navigation.navigate("authentication", { screen: "login", params: { demoLogin: true } }) }>
        { strings.generic.login }
      </Button>
      <View>
        <Text style={{ textAlign: "center", padding: theme.spacing(2) }}>
          { strings.auth.newAccount }
        </Text>
        <Text
          onPress={ () => Linking.openURL("https://www.seligson.fi/sco/suomi/asiointi/omasalkku/") }
          style={{ textAlign: "center", textDecorationLine: "underline" }}
        >
          { strings.generic.webPage }
        </Text>
      </View>
    </View>
  );
};

export default LoginRequiredScreen;