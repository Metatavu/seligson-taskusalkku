import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeNavigator from "../../types/navigators/home";
import PortfolioScreen from "./home/portfolio-screen";
import strings from "../../localization/strings";
import { useTheme } from "react-native-paper";
import PublicationsScreen from "./home/publications-screen";
import MeetingsScreen from "./home/meetings-screen";
import FundsScreen from "./home/funds-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * Home screen bottom tab navigation
 */
const HomeNavigation = createBottomTabNavigator<HomeNavigator.Routes>();

/**
 * Home screen component
 */
const HomeScreen: React.FC = () => {
  const { colors } = useTheme();

  /**
   * Returns tab bar icon from given icon name
   *
   * @param name icon name
   */
  const getTabBarIcon = (name: IconName) => ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons
      name={ name }
      size={ size }
      color={ color }
    />
  );

  /**
   * Component render
   */
  return (
    <HomeNavigation.Navigator
      initialRouteName="funds"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        unmountOnBlur: true,
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarHideOnKeyboard: true
      }}
      screenListeners={
        ({ navigation, route }) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.jumpTo(route.name);
          }
        })
      }
    >
      <HomeNavigation.Screen
        name="portfolio"
        component={ PortfolioScreen }
        options={{
          tabBarIcon: getTabBarIcon("briefcase-outline"),
          tabBarLabel: strings.screenTitles.portfolio,
          title: strings.screenTitles.portfolio
        }}
      />
      <HomeNavigation.Screen
        name="funds"
        component={ FundsScreen }
        options={{
          tabBarIcon: getTabBarIcon("clipboard-text-outline"),
          tabBarLabel: strings.screenTitles.funds,
          title: strings.screenTitles.funds
        }}
      />
      <HomeNavigation.Screen
        name="publications"
        component={ PublicationsScreen }
        options={{
          tabBarIcon: getTabBarIcon("book-open-outline"),
          tabBarLabel: strings.screenTitles.publications,
          title: strings.screenTitles.publications
        }}
      />
      <HomeNavigation.Screen
        name="meetings"
        component={ MeetingsScreen }
        options={{
          tabBarIcon: getTabBarIcon("calendar"),
          tabBarLabel: strings.screenTitles.meetings,
          title: strings.screenTitles.meetings
        }}
      />
    </HomeNavigation.Navigator>
  );
};

export default HomeScreen;