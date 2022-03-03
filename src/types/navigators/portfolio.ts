import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { Fund } from "../../generated/client/models/Fund";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import PortfolioTabsNavigator from "./portfolio-tabs";
import { SubscriptionSettings } from "..";
import { PortfolioTransaction, Security } from "../../generated/client";

/**
 * Portfolio navigator
 */
namespace PortfolioNavigator {

  /**
   * Routes
   */
  export type Routes = {
    portfolioTabs: NavigatorScreenParams<PortfolioTabsNavigator.Routes> | undefined;
    mySecurityDetails: { fund: Fund };
    transactionsDetails: {
      fund: Fund;
      security: Security;
      portfolioTransaction: PortfolioTransaction;
    };
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

export default PortfolioNavigator;