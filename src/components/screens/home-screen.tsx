import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeNavigator from "../../types/navigators/home";
import PortfolioScreen from "./home/portfolio-screen";
import strings from "../../localization/strings";
import { useTheme } from "react-native-paper";
import PublicationsScreen from "./home/publications-screen";
import MeetingsScreen from "./home/meetings-screen";
import FundsScreen from "./home/funds-screen";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import Config from "../../app/config";

/**
 * Home screen bottom tab navigation
 */
const HomeNavigation = createMaterialBottomTabNavigator<HomeNavigator.Routes>();

/**
 * Home screen component
 */
const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const auth = useAppSelector(selectAuth);
  const [ initialRoute, setInitialRoute ] = React.useState<keyof HomeNavigator.Routes>();

  /**
   * Defines initial route depending on auth and local storage value
   */
  const checkInitialRoute = async () => {
    if (!auth) {
      setInitialRoute("funds");
      return;
    }

    const localStorageRoute = await Config.getLocalValue("@initialRoute");
    setInitialRoute(localStorageRoute || "portfolio");
  };

  /**
   * Effect for checking initial route when component mounts
   */
  React.useEffect(() => { checkInitialRoute(); }, []);

  if (initialRoute === undefined) {
    return null;
  }

  /**
   * Component render
   */
  return (
    <HomeNavigation.Navigator
      initialRouteName={ initialRoute }
      shifting={ false }
      backBehavior="history"
      activeColor={ colors.primary }
      inactiveColor={ colors.grey[400] }
      barStyle={{ backgroundColor: colors.surface }}
    >
      <HomeNavigation.Group>
        <HomeNavigation.Screen
          name="portfolio"
          component={ PortfolioScreen }
          options={{
            tabBarIcon: "briefcase-outline",
            tabBarLabel: strings.screenTitles.portfolio,
            title: strings.screenTitles.portfolio
          }}
        />
        <HomeNavigation.Screen
          name="funds"
          component={ FundsScreen }
          options={{
            tabBarIcon: "clipboard-text-outline",
            tabBarLabel: strings.screenTitles.funds,
            title: strings.screenTitles.funds
          }}
        />
        <HomeNavigation.Screen
          name="publications"
          component={ PublicationsScreen }
          options={{
            tabBarIcon: "book-open-outline",
            tabBarLabel: strings.screenTitles.publications,
            title: strings.screenTitles.publications
          }}
        />
        <HomeNavigation.Screen
          name="meetings"
          component={ MeetingsScreen }
          options={{
            tabBarIcon: "calendar",
            tabBarLabel: strings.screenTitles.meetings,
            title: strings.screenTitles.meetings
          }}
        />
      </HomeNavigation.Group>
    </HomeNavigation.Navigator>
  );
};

export default HomeScreen;