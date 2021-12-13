import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TransactionsNavigator from "../../../types/navigators/transactions";
import TransactionsList from "./transactions-list";
import TransactionsDetailsScreen from "./transactions-details-screen";

/**
 * Transactions screen stack navigation
 */
const TransactionNavigation = createNativeStackNavigator<TransactionsNavigator.Routes>();

/**
 * Transactions screen
 */
const TransactionsScreen: React.FC = () => {
  /**
   * Component render
   */
  return (
    <TransactionNavigation.Navigator
      initialRouteName="transactionsList"
      screenOptions={{
        headerShown: false
      }}
    >
      <TransactionNavigation.Group>
        <TransactionNavigation.Screen
          name="transactionsList"
          component={ TransactionsList }
        />
        <TransactionNavigation.Screen
          name="transactionsDetails"
          component={ TransactionsDetailsScreen }
        />
      </TransactionNavigation.Group>
    </TransactionNavigation.Navigator>
  );
};

export default TransactionsScreen;