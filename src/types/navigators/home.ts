import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import PortfolioNavigator from "./portfolio";
import FundsNavigator from "./funds";
import PublicationsNavigator from "./publications";
import MeetingNavigator from "./meeting";

/**
 * Home navigator
 */
namespace HomeNavigator {
  /**
   * Home navigation routes
   */
  export type Routes = {
    portfolio: NavigatorScreenParams<PortfolioNavigator.Routes> | undefined;
    funds: NavigatorScreenParams<FundsNavigator.Routes> | undefined;
    publications: NavigatorScreenParams<PublicationsNavigator.Routes> | undefined;
    meetings: NavigatorScreenParams<MeetingNavigator.Routes> | undefined;
  };

  /**
   * Navigation properties
   */
  export type NavigationProps<RouteName extends keyof Routes = keyof Routes> = BottomTabNavigationProp<Routes, RouteName>;

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