import { RouteProp } from "@react-navigation/native";
import { MaterialTopTabBarProps, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

/**
 * Funds list navigator
 */
namespace FundsListNavigator {

  /**
   * Routes
   */
  export type Routes = {
    passiveFunds: undefined;
    activeFunds: undefined;
    interestFunds: undefined;
    combinationFunds: undefined;
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

export default FundsListNavigator;