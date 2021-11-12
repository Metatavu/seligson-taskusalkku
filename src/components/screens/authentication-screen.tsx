import React from "react";
import { useTheme } from "react-native-paper";
import strings from "../../localization/strings";
import AuthNavigator from "../../types/navigators/auth";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import StrongAuthView from "./auth/strong-auth-view";

/**
 * 
 */
const AuthNavigation = createMaterialTopTabNavigator<AuthNavigator.Routes>();

/**
 * Authentication screen
 */
const AuthenticationScreen: React.FC = () => {
  const { colors } = useTheme();

  /**
   * Component render
   */
  return (
    <AuthNavigation.Navigator
      initialRouteName="welcome"
      screenOptions={{
        tabBarActiveTintColor: colors.surface,
        tabBarPressColor: colors.surface,
        tabBarStyle: { backgroundColor: colors.primary, elevation: 8 },
        tabBarIndicatorStyle: { backgroundColor: colors.surface },
        tabBarLabelStyle: {
          fontSize: 10,
          textTransform: "none",
          flexWrap: "nowrap",
          fontFamily: "NotoSans_400Regular"
        }
      }}
    >
      <AuthNavigation.Screen
        name="login"
        component={ StrongAuthView }
        options={{ title: strings.screenTitles.passiveFunds }}
      />
    </AuthNavigation.Navigator>
  );
};

export default AuthenticationScreen;