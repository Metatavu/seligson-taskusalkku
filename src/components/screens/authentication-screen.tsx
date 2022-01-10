import React from "react";
import AuthNavigator from "../../types/navigators/auth";
import WelcomeScreen from "./auth/welcome-screen";
import StrongAuthView from "./auth/strong-auth-view";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/**
 * Auth stack navigator
 */
const AuthNavigation = createNativeStackNavigator<AuthNavigator.Routes>();

/**
 * Authentication screen component
 */
const AuthenticationScreen: React.FC = () => {
  /**
   * Component render
   */
  return (
    <AuthNavigation.Navigator
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false
      }}
    >
      <AuthNavigation.Screen
        name="welcome"
        component={ WelcomeScreen }
      />
      <AuthNavigation.Screen
        name="login"
        component={ StrongAuthView }
      />
    </AuthNavigation.Navigator>
  );
};

export default AuthenticationScreen;