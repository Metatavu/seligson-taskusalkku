import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TransactionsNavigator from "../../../types/navigators/transactions";
import TransactionsListScreen from "./transactions-list-screen";
import TransactionDetailsScreen from "./transaction-details-screen";

/**
 * Transactions screen stack navigation
 */
const TransactionNavigation = createNativeStackNavigator<TransactionsNavigator.Routes>();

/**
 * Transactions screen component
 */
const TransactionsScreen: React.FC = () => (
  <TransactionNavigation.Navigator
    initialRouteName="transactionsList"
    screenOptions={{
      headerShown: false
    }}
  >
    <TransactionNavigation.Group>
      <TransactionNavigation.Screen
        name="transactionsList"
        component={ TransactionsListScreen }
      />
      <TransactionNavigation.Screen
        name="transactionsDetails"
        component={ TransactionDetailsScreen }
      />
    </TransactionNavigation.Group>
  </TransactionNavigation.Navigator>
);

export default TransactionsScreen;