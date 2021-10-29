import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import strings from "../../../localization/strings";
import { useTheme } from "react-native-paper";
import FundsNavigator from "../../../types/navigators/funds";
import PassiveFundsScreen from "../funds/passive-funds-screen";
import ActiveFundsScreen from "../funds/active-funds-screen";
import InterestFundsScreen from "../funds/interest-funds-screen";
import CombinationFundsScreen from "../funds/combination-funds-screen";

/**
 * Funds screen tab navigation
 */
const FundsNavigation = createMaterialTopTabNavigator<FundsNavigator.Routes>();

/**
 * Funds screen
 */
const FundsScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <FundsNavigation.Navigator
      initialRouteName="passiveFunds"
      screenOptions={{
        tabBarActiveTintColor: colors.surface,
        tabBarPressColor: colors.surface,
        tabBarStyle: { backgroundColor: colors.primary, elevation: 8 },
        tabBarIndicatorStyle: { backgroundColor: colors.surface },
        tabBarLabelStyle: {
          fontSize: 10,
          textTransform: "none",
          flexWrap: "nowrap",
          fontFamily: "NotoSans_400Regular"
        }
      }}
    >
      <FundsNavigation.Screen
        name="passiveFunds"
        component={ PassiveFundsScreen }
        options={{ title: strings.screenTitles.passiveFunds }}
      />
      <FundsNavigation.Screen
        name="activeFunds"
        component={ ActiveFundsScreen }
        options={{ title: strings.screenTitles.activeFunds }}
      />
      <FundsNavigation.Screen
        name="interestFunds"
        component={ InterestFundsScreen }
        options={{ title: strings.screenTitles.interestFunds }}
      />
      <FundsNavigation.Screen
        name="combinationFunds"
        component={ CombinationFundsScreen }
        options={{ title: strings.screenTitles.combinationFunds }}
      />
    </FundsNavigation.Navigator>
  );
};

export default FundsScreen;