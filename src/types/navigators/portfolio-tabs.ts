import { RouteProp } from "@react-navigation/native";
import { MaterialTopTabBarProps, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

/**
 * Portfolio tabs navigator
 */
namespace PortfolioTabsNavigator {

  /**
   * Routes
   */
  export type Routes = {
    statistics: undefined;
    distributions: undefined;
    mySecurities: undefined;
    transactions: undefined;
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

export default PortfolioTabsNavigator;