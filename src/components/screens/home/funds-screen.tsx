import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FundsNavigator from "../../../types/navigators/funds";
import FundDetailsScreen from "../funds/fund-details-screen";
import FundTabsScreen from "../funds/fund-tabs-screen";
import SubscriptionSettingsScreen from "../funds/subscription-settings-screen";
import SubscriptionSummaryScreen from "../funds/subscription-summary-screen";

/**
 * Fund screen stack navigation
 */
const FundsNavigation = createNativeStackNavigator<FundsNavigator.Routes>();

/**
 * Funds screen component
 */
const FundsScreen: React.FC = () => {
  return (
    <FundsNavigation.Navigator
      initialRouteName="fundTabs"
      screenOptions={{ headerShown: false }}
    >
      <FundsNavigation.Screen
        name="fundTabs"
        component={ FundTabsScreen }
      />
      <FundsNavigation.Screen
        name="fundDetails"
        component={ FundDetailsScreen }
      />
      <FundsNavigation.Screen
        name="fundSubscriptionSettings"
      >
        { () =>
          <SubscriptionSettingsScreen
            onProceed={ (navigation, subscriptionSettings) =>
              navigation.navigate(
                "fundSubscriptionSummary",
                { subscriptionSettings: subscriptionSettings }
              )
            }
          />
        }
      </FundsNavigation.Screen>
      <FundsNavigation.Screen
        name="fundSubscriptionSummary"
        component={ SubscriptionSummaryScreen }
      />
    </FundsNavigation.Navigator>
  );
};

export default FundsScreen;