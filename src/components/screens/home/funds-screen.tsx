import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FundSelectionNavigator from "../../../types/navigators/funds";
import FundDetailsScreen from "../funds/fund-details-screen";
import FundsListScreen from "../funds/funds-list-screen";
import SubscriptionSettingsScreen from "../funds/subscription-settings-screen";
import SubscriptionSummaryScreen from "../funds/subscription-summary-screen";

/**
 * Fund selection screen stack navigation
 */
const FundSelectionNavigation = createNativeStackNavigator<FundSelectionNavigator.Routes>();

/**
 * Active funds screen component
 */
const FundsScreen: React.FC = () => {
  /**
   * Component render
   */
  return (
    <FundSelectionNavigation.Navigator
      initialRouteName="fundsList"
      screenOptions={{ headerShown: false }}
    >
      <FundSelectionNavigation.Group>
        <FundSelectionNavigation.Screen
          name="fundsList"
          component={ FundsListScreen }
        />
        <FundSelectionNavigation.Screen
          name="fundDetails"
          component={ FundDetailsScreen }
        />
        <FundSelectionNavigation.Screen
          name="fundSubscriptionSettings"
          component={ SubscriptionSettingsScreen }
        />
        <FundSelectionNavigation.Screen
          name="fundSubscriptionSummary"
          component={ SubscriptionSummaryScreen }
        />
      </FundSelectionNavigation.Group>
    </FundSelectionNavigation.Navigator>
  );
};

export default FundsScreen;