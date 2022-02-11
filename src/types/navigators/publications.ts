import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import PublicationsListNavigator from "./publications-list";

/**
 * Publications navigator
 */
namespace PublicationsNavigator {

  /**
   * Routes
   */
  export type Routes = {
    publicationsList: NavigatorScreenParams<PublicationsListNavigator.Routes> | undefined;
    publicationDetails: {
      publicationId: number;
      subject: keyof PublicationsListNavigator.Routes;
    };
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

export default PublicationsNavigator;