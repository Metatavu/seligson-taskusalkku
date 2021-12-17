import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Fund, PortfolioTransaction, Security } from "../../generated/client";

/**
 * Transactions navigator
 */
namespace TransactionsNavigator {

  /**
   * Routes
   */
  export type Routes = {
    transactionsList: undefined;
    transactionsDetails: {
      fund: Fund;
      security: Security;
      portfolioTransaction: PortfolioTransaction;
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

export default TransactionsNavigator;