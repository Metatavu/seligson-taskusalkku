import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PortfolioNavigator from "../../../types/navigators/portfolio";
import PortfolioTabsScreen from "../portfolio/portfolio-tabs-screen";
import MySecurityDetailsScreen from "../portfolio/my-security-details-screen";
import SubscriptionSummaryScreen from "../funds/subscription-summary-screen";
import SubscriptionSettingsScreen from "../funds/subscription-settings-screen";
import TransactionDetailsScreen from "../portfolio/transaction-details-screen";

/**
 * Portfolio screen stack navigation
 */
const PortfolioNavigation = createNativeStackNavigator<PortfolioNavigator.Routes>();

/**
 * Portfolio screen component
 */
const PortfolioScreen: React.FC = () => {
  return (
    <PortfolioNavigation.Navigator
      initialRouteName="portfolioTabs"
      screenOptions={{ headerShown: false }}
    >
      <PortfolioNavigation.Screen
        name="portfolioTabs"
        component={ PortfolioTabsScreen }
      />
      <PortfolioNavigation.Screen
        name="mySecurityDetails"
        component={ MySecurityDetailsScreen }
      />
      <PortfolioNavigation.Screen
        name="transactionsDetails"
        component={ TransactionDetailsScreen }
      />
      <PortfolioNavigation.Screen
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
      </PortfolioNavigation.Screen>
      <PortfolioNavigation.Screen
        name="fundSubscriptionSummary"
        component={ SubscriptionSummaryScreen }
      />
    </PortfolioNavigation.Navigator>
  );
};

export default PortfolioScreen;