import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Config from "../../app/config";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/auth-slice";
import strings from "../../localization/strings";
import theme from "../../theme";
import AuthNavigator from "../../types/navigators/auth";
import AuthUtils from "../../utils/auth";
import styles from "../../styles/screens/account-screen";
import Icon from "react-native-vector-icons/FontAwesome";

/**
 * Account screen
 */
const AccountScreen: React.FC = () => {
  const { developmentBuild } = Config.getStatic();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AuthNavigator.NavigationProps>();

  /**
   * Removes local values
   */
  const removeLocalValues = async () => {
    dispatch(logout());
    await Promise.all([
      AuthUtils.removeOfflineToken()
    ]);

    navigation.navigate("welcome");
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
   * Selection
   */
  const renderSelection = (title: string, text: string, icon: string, selected: boolean) => {
    const [checked, setChecked] = React.useState(selected);
    const color = checked ? theme.colors.primary : theme.colors.unSelected;

    /**
     * Selection icon
     */
    const selectedIcon = () => {
      return (
        <TouchableOpacity
          onPress={() => {
            setChecked(!checked);
          }}
        >
          <View style={{
            marginRight: theme.spacing(2),
            borderWidth: 0.5,
            borderRadius: 25,
            height: 36,
            width: 36,
            borderColor: color,
            alignItems: "center",
            justifyContent: "center"
          }}
          >
            { checked === true ? <Icon name="check" size={ 20 } color={ color }/> : null}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flexDirection: "row", marginTop: theme.spacing(1) }}>
        { selectedIcon() }
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name={ icon } size={ 14 } color={ color } style={{ marginRight: theme.spacing(1) }}/>
            <Text style={[ theme.fonts.medium, { color: color }]}>
              { title }
            </Text>
          </View>
          <Text style={{ color: color }}>
            { text }
          </Text>
        </View>
      </View>
    );
  };

  /**
   * Start settings card
   */
  const renderStartingSettings = () => {
    return (
      <View style={ styles.cardWrapper }>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={ theme.fonts.medium }>
            { strings.settings.startScreen }
          </Text>
          { renderSelection("Salkku", "Rahastosalkkusi näytetään heti, kun avaat sovelluksen (Vaatii kirjautumisen tai lukituksen avaamisen)", "suitcase", true) }
          { renderSelection("Rahastoarvot", "Rahastosalkkusi näytetään heti, kun avaat sovelluksen (Vaatii kirjautumisen tai lukituksen avaamisen)", "clipboard", false) }
        </View>
      </View>
    );
  };

  /**
   * Login settings card
   */
  const renderLoginSettings = () => {
    return (
      <View style={ styles.cardWrapper }>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={ theme.fonts.medium }>
            { strings.settings.loginMethod }
          </Text>
          { renderSelection("Käyttäjätunnus ja salasana", "Sovelluksen kirjaudutaan käyttäjätunnuksella ja salasanalla.", "unlock", true) }
          { renderSelection("Turvaluku", "Pysyt kirjautuneena, mutta sovelluksen lukitus avataan valitsemallasi salasanalla.", "th", false) }
          { renderSelection("Biometrinen tunnistuns", "Pysyt kirjautuneena, mutta sovelluksen lukitus avataan sormenjäljelläsi tai kasvotunnistuksella.", "th", false) }
          { renderSelection("Vahva tunnistautuminen", "Pysyt kirjautuneena, mutta sovelluksen lukitus avataan sormenjäljelläsi tai kasvotunnistuksella.", "university", false) }
        </View>
      </View>
    );
  };
  
  /**
   * Language settings card
   */
  const renderLanguageSettings = () => {
    return (
      <View style={ styles.cardWrapper }>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={ theme.fonts.medium }>
            { strings.settings.appLanguage }
          </Text>
          { renderSelection("Suomi", "", "globe", true) }
          { renderSelection("Svenska", "", "globe", false) }
          { renderSelection("English", "", "globe", false) }
        </View>
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={{ padding: theme.spacing(2) }}>
        { renderStartingSettings() }
        { renderLoginSettings() }
        { renderLanguageSettings() }
      </View>
    </ScrollView>
  );
};

export default AccountScreen;