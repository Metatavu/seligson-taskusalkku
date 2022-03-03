/* eslint-disable object-shorthand */
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import strings from "../../../localization/strings";
import { useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PortfolioTabsNavigator from "../../../types/navigators/portfolio-tabs";
import StatisticsScreen from "./statistics-screen";
import DistributionsScreen from "./distributions-screen";
import MySecuritiesScreen from "./my-securities-screen";
import PortfolioContextProvider from "../../providers/portfolio-provider";
import LoginRequiredScreen from "../auth/login-required-screen";
import TransactionsScreen from "./transactions-screen";
import { Dimensions } from "react-native";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/auth-slice";

/**
 * Portfolio tabs screen navigation
 */
const PortfolioTabsNavigation = createMaterialTopTabNavigator<PortfolioTabsNavigator.Routes>();

/**
 * Portfolio tabs screen component
 */
const PortfolioTabsScreen: React.FC = () => {
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
      <PortfolioTabsNavigation.Navigator
        initialRouteName="statistics"
        initialLayout={{ width: Dimensions.get("window").width }}
        backBehavior="history"
        screenOptions={{
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
        <PortfolioTabsNavigation.Screen
          name="statistics"
          component={ StatisticsScreen }
          options={{
            swipeEnabled: false,
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
        <PortfolioTabsNavigation.Screen
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
        <PortfolioTabsNavigation.Screen
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
        <PortfolioTabsNavigation.Screen
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
      </PortfolioTabsNavigation.Navigator>
    </PortfolioContextProvider>
  );
};

export default PortfolioTabsScreen;