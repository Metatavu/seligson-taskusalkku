import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import AuthNavigator from "./auth";
import HomeNavigator from "./home";

/**
 * Root navigator
 */
namespace RootNavigator {

  /**
   * Routes
   */
  export type Routes = {
    home: NavigatorScreenParams<HomeNavigator.Routes> | undefined;
    account: undefined;
    authentication: NavigatorScreenParams<AuthNavigator.Routes> | undefined;
    registration: undefined;
  };

  /**
   * Navigation properties
   */
  export type NavigationProps<RouteName extends keyof Routes = keyof Routes> = NativeStackNavigationProp<Routes, RouteName>;

  /**
   * Route properties
   */
  export type RouteProps<RouteName extends keyof Routes = keyof Routes> = RouteProp<Routes, RouteName>;

  /**
   * Screen properties
   */
  export type ScreenProps<RouteName extends keyof Routes = keyof Routes> = NativeStackScreenProps<Routes, RouteName>;

}

export default RootNavigator;