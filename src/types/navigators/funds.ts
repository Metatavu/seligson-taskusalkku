import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { Fund } from "../../generated/client/models/Fund";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import FundTabsNavigator from "./fund-tabs";
import { SubscriptionSettings } from "..";

/**
 * Funds navigator
 */
namespace FundsNavigator {

  /**
   * Routes
   */
  export type Routes = {
    fundTabs: NavigatorScreenParams<FundTabsNavigator.Routes> | undefined;
    fundDetails: { fund: Fund };
    fundSubscriptionSettings: { fund: Fund };
    fundSubscriptionSummary: { subscriptionSettings: SubscriptionSettings };
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

export default FundsNavigator;