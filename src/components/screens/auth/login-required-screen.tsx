import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Linking, View, Text } from "react-native";
import { Button } from "react-native-paper";
import strings from "../../../localization/strings";
import RootNavigator from "../../../types/navigators/root";
import styles from "../../../styles/screens/auth/login-required-screen";
import SeligsonLogo from "../../../../assets/seligson-logo";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

/**
 * Login required screen component
 */
const LoginRequiredScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigator.NavigationProps>();

  const [ counter, setCounter ] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout>();

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

    navigation.navigate("authentication", {
      screen: "login",
      params: { demoLogin: true }
    });
  };

  /**
   * Component render
   */
  return (
    <View style={ styles.loginScreen }>
      <View style={ styles.cardWrapper }>
        <View style={ styles.cardContent }>
          <TouchableWithoutFeedback onPress={ handlePress }>
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