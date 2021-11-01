import { RouteProp } from "@react-navigation/native";
import { MaterialBottomTabNavigationProp } from "@react-navigation/material-bottom-tabs";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

/**
 * Home navigator
 */
namespace HomeNavigator {
  /**
   * Home navigation routes
   */
  export type Routes = {
    portfolio: undefined;
    funds: undefined;
    publications: undefined;
    others: undefined;
  };

  /**
   * Navigation properties
   */
  export type NavigationProps<RouteName extends keyof Routes = keyof Routes> = MaterialBottomTabNavigationProp<Routes, RouteName>;

  /**
   * Route properties
   */
  export type RouteProps<RouteName extends keyof Routes = keyof Routes> = RouteProp<Routes, RouteName>;

  /**
   * Screen properties
   */
  export type ScreenProps<RouteName extends keyof Routes = keyof Routes> = MaterialTopTabScreenProps<Routes, RouteName>;
}

export default HomeNavigator;