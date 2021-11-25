/* eslint-disable object-shorthand */
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import strings from "../../../localization/strings";
import { useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PortfolioNavigator from "../../../types/navigators/portfolio";
import StatisticsScreen from "../portfolio/statistics-screen";
import DistributionsScreen from "../portfolio/distributions-screen";
import MyFundsScreen from "../portfolio/my-funds-screen";
import EventsScreen from "../portfolio/events-screen";
import PortfolioContextProvider from "../portfolio/portfolio-context-provider";

/**
 * Portfolio screen tab navigation
 */
const PortfolioNavigation = createMaterialTopTabNavigator<PortfolioNavigator.Routes>();

/**
 * Portfolio screen
 */
const PortfolioScreen: React.FC = () => {
  const { colors } = useTheme();

  /**
   * Component render
   */
  return (
    <PortfolioContextProvider>
      <PortfolioNavigation.Navigator
        initialRouteName="statistics"
        backBehavior="history"
        screenOptions={{
          tabBarActiveTintColor: colors.surface,
          tabBarPressColor: colors.surface,
          tabBarStyle: { backgroundColor: colors.primary, elevation: 8 },
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
          name="myFunds"
          component={ MyFundsScreen }
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
          name="events"
          component={ EventsScreen }
          options={{
            title: strings.screenTitles.events,
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