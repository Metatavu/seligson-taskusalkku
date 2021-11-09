import React from "react";
import { getFocusedRouteNameFromRoute, NavigationContainer, Route } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import moment from "moment";
import "moment/locale/fi";
import strings from "./src/localization/strings";
import { IconButton, useTheme } from "react-native-paper";
import AppLoading from "expo-app-loading";
import { NotoSans_400Regular, NotoSans_700Bold, useFonts } from "@expo-google-fonts/noto-sans";
import RootNavigator from "./src/types/navigators/root";
import HomeScreen from "./src/components/screens/home-screen";
import AccountScreen from "./src/components/screens/account-screen";
import AuthenticationScreen from "./src/components/screens/authentication-screen";
import RegistrationScreen from "./src/components/screens/registration-screen";

strings.setLanguage("fi");
moment.locale(strings.getLanguage());

/**
 * App root stack navigator
 */
const RootNavigation = createNativeStackNavigator<RootNavigator.Routes>();

/**
 * Application component
 */
const App: React.FC = () => {
  const { colors } = useTheme();

  const [ fontsLoaded ] = useFonts({
    NotoSans_400Regular: NotoSans_400Regular,
    NotoSans_700Bold: NotoSans_700Bold
  });

  /**
   * Returns localized header title from current route
   *
   * @param route route
   */
  const getHeaderTitle = (route: Route<any>) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (!routeName) return strings.screenTitles.portfolio;
    return strings.screenTitles[routeName as keyof typeof strings.screenTitles];
  };

  /**
   * Returns screen options
   *
   * @param props root navigation properties
   */
  const getScreenOptions = ({ navigation, route }: RootNavigator.ScreenProps): NativeStackNavigationOptions => ({
    gestureEnabled: false,
    headerShown: false,
    title: getHeaderTitle(route),
    headerTitleAlign: "center",
    headerTitleStyle: {
      color: colors.primary,
      fontFamily: "NotoSans_700Bold",
      fontSize: 16
    },
    headerRight: () => (
      <IconButton
        icon="account-outline"
        color={ colors.primary }
        onPress={ () => navigation.navigate("account") }
      />
    )
  });

  if (!fontsLoaded) {
    return <AppLoading/>;
  }

  /**
   * Component render
   */
  return (
    <NavigationContainer>
      <RootNavigation.Navigator
        initialRouteName="home"
        screenOptions={ getScreenOptions }
      >
        <RootNavigation.Screen
          name="home"
          component={ HomeScreen }
          options={{ headerShown: true }}
        />
        <RootNavigation.Screen
          name="account"
          component={ AccountScreen }
          options={{ headerShown: true, title: strings.screenTitles.profile }}
        />
        <RootNavigation.Screen
          name="authentication"
          component={ AuthenticationScreen }
        />
        <RootNavigation.Screen
          name="registration"
          component={ RegistrationScreen }
        />
      </RootNavigation.Navigator>
    </NavigationContainer>
  );
};

export default App;