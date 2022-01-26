/* eslint-disable object-shorthand */
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import strings from "../../../localization/strings";
import { useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PortfolioNavigator from "../../../types/navigators/portfolio";
import StatisticsScreen from "../portfolio/statistics-screen";
import DistributionsScreen from "../portfolio/distributions-screen";
import MySecuritiesScreen from "../portfolio/my-securities-screen";
import PortfolioContextProvider from "../../providers/portfolio-provider";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/auth-slice";
import LoginRequiredScreen from "../auth/login-required-screen";
import TransactionsScreen from "../portfolio/transactions-screen";
import { Dimensions } from "react-native";

/**
 * Portfolio screen tab navigation
 */
const PortfolioNavigation = createMaterialTopTabNavigator<PortfolioNavigator.Routes>();

/**
 * Portfolio screen component
 */
const PortfolioScreen: React.FC = () => {
  const { colors } = useTheme();
  const auth = useAppSelector(selectAuth);

  if (!auth) {
    return <LoginRequiredScreen/>;
  }

  /**
   * Component render
   */
  return (
    <PortfolioContextProvider>
      <PortfolioNavigation.Navigator
        initialRouteName="statistics"
        initialLayout={{ width: Dimensions.get("window").width }}
        backBehavior="history"
        screenOptions={{
          lazy: true,
          tabBarActiveTintColor: colors.surface,
          tabBarPressColor: colors.surface,
          tabBarStyle: {
            backgroundColor: colors.primary,
            elevation: 8,
            height: 60,
            justifyContent: "center"
          },
          tabBarIndicatorStyle: { backgroundColor: colors.surface },
          tabBarLabelStyle: {
            fontSize: 9,
            textTransform: "none",
            fontFamily: "NotoSans_400Regular",
            marginBottom: -1
          }
        }}
      >
        <PortfolioNavigation.Screen
          name="statistics"
          component={ StatisticsScreen }
          options={{
            title: strings.screenTitles.statistics,
            tabBarIcon: props => (
              <MaterialCommunityIcons
                name="poll"
                size={ 24 }
                { ...props }
              />
            )
          }}
        />
        <PortfolioNavigation.Screen
          name="distributions"
          component={ DistributionsScreen }
          options={{
            title: strings.screenTitles.distributions,
            tabBarIcon: props => (
              <MaterialCommunityIcons
                name="chart-pie"
                size={ 24 }
                { ...props }
              />
            )
          }}
        />
        <PortfolioNavigation.Screen
          name="mySecurities"
          component={ MySecuritiesScreen }
          options={{
            title: strings.screenTitles.ownFunds,
            tabBarIcon: props => (
              <MaterialCommunityIcons
                name="inbox-outline"
                size={ 24 }
                { ...props }
              />
            )
          }}
        />
        <PortfolioNavigation.Screen
          name="transactions"
          component={ TransactionsScreen }
          options={{
            title: strings.screenTitles.transactions,
            tabBarIcon: props => (
              <MaterialCommunityIcons
                name="compare-horizontal"
                size={ 24 }
                { ...props }
              />
            )
          }}
        />
      </PortfolioNavigation.Navigator>
    </PortfolioContextProvider>
  );
};

export default PortfolioScreen;