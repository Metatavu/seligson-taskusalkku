import { RouteProp } from "@react-navigation/native";
import { MaterialTopTabBarProps, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

/**
 * Portfolio navigator
 */
namespace PortfolioNavigator {

  /**
   * Routes
   */
  export type Routes = {
    statistics: undefined;
    distributions: undefined;
    myFunds: undefined;
    events: undefined;
  };

  /**
   * Navigation properties
   */
  export type NavigationProps = MaterialTopTabBarProps;

  /**
   * Route properties
   */
  export type RouteProps<RouteName extends keyof Routes = keyof Routes> = RouteProp<Routes, RouteName>;

  /**
   * Screen properties
   */
  export type ScreenProps<RouteName extends keyof Routes = keyof Routes> = MaterialTopTabScreenProps<Routes, RouteName>;

}

export default PortfolioNavigator;