import React from "react";
import { getFocusedRouteNameFromRoute, NavigationContainer, Route } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "moment/locale/fi";
import "moment/locale/sv";
import strings from "./localization/strings";
import { IconButton, useTheme } from "react-native-paper";
import AppLoading from "expo-app-loading";
import { NotoSans_400Regular, NotoSans_700Bold, useFonts } from "@expo-google-fonts/noto-sans";
import RootNavigator from "./types/navigators/root";
import HomeScreen from "./components/screens/home-screen";
import SettingsScreen from "./components/screens/settings-screen";
import AuthenticationScreen from "./components/screens/authentication-screen";
import RegistrationScreen from "./components/screens/registration-screen";
import { useAppSelector, useExitAppHandler } from "./app/hooks";
import { Platform } from "react-native";
import { selectSelectedLanguage } from "./features/locale/locale-slice";

/**
 * Root stack navigator
 */
const RootNavigation = createNativeStackNavigator<RootNavigator.Routes>();

/**
 * Root component
 */
const Root: React.FC = () => {
  useExitAppHandler();
  const { colors } = useTheme();
  useAppSelector(selectSelectedLanguage);

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

  if (!fontsLoaded) {
    return <AppLoading/>;
  }

  /**
   * Component render
   */
  return (
    <NavigationContainer>
      <RootNavigation.Navigator
        initialRouteName="registration"
        screenOptions={
          ({ navigation, route }) => ({
            gestureEnabled: false,
            headerShown: false,
            headerBackVisible: false,
            title: getHeaderTitle(route),
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: colors.primary,
              fontFamily: "NotoSans_700Bold",
              fontSize: 16
            },
            headerLeft: () => {
              if (Platform.OS !== "ios" || route.name !== "account") {
                return;
              }

              return (
                <IconButton
                  icon="arrow-left"
                  color={ colors.primary }
                  onPress={ navigation.goBack }
                />
              );
            },
            headerRight: () => (
              <IconButton
                icon="cog-outline"
                color={ colors.primary }
                onPress={ () => navigation.navigate("account") }
              />
            )
          })
        }
      >
        <RootNavigation.Screen
          name="home"
          component={ HomeScreen }
          options={{ headerShown: true }}
        />
        <RootNavigation.Screen
          name="account"
          component={ SettingsScreen }
          options={{
            headerShown: true,
            title: strings.screenTitles.profile
          }}
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

export default Root;