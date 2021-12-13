import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Linking, View } from "react-native";
import { Button, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import RootNavigator from "../../../types/navigators/root";
import styles from "../../../styles/screens/auth/login-required-screen";
import SeligsonLogo from "../../../../assets/seligsonLogo";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

/**
 * Login required screen component
 */
const LoginRequiredScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigator.NavigationProps>();
  const [ counter, setCounter ] = React.useState(0);

  /**
   * Login counter
   */
  const handlePress = () => {
    if (counter >= 10) {
      setCounter(0);
      navigation.navigate("authentication", { screen: "login", params: { demoLogin: true } });
    } else setCounter(counter + 1);
  };

  return (
    <View style={ styles.loginScreen }>
      <View style={ styles.cardWrapper }>
        <View style={ styles.cardContent }>
          <TouchableWithoutFeedback
            onPress={ handlePress }
          >
            <SeligsonLogo/>
          </TouchableWithoutFeedback>
          <Text style={ styles.titleText }>
            { strings.auth.loginRequired }
          </Text>
          <Button
            onPress={ () => navigation.navigate("authentication", { screen: "login" }) }
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
};

export default LoginRequiredScreen;