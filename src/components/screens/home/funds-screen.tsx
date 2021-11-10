import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FundSelectionNavigator from "../../../types/navigators/funds";
import FundDetailsScreen from "../funds/funds-details-screen";
import FundsListScreen from "../funds/funds-list-screen";

/**
 * Fund selection screen stack navigation
 */
const FundSelectionNavigation = createNativeStackNavigator<FundSelectionNavigator.Routes>();

/**
 * Active funds screen
 */
const FundsScreen: React.FC = () => {
  /**
   * Component render
   */
  return (
    <FundSelectionNavigation.Navigator
      initialRouteName="fundsList"
      screenOptions={{
        headerShown: false
      }}
    >
      <FundSelectionNavigation.Group>
        <FundSelectionNavigation.Screen
          name="fundsList"
          component={ FundsListScreen }
        />
        <FundSelectionNavigation.Screen
          name="fundsDetails"
          component={ FundDetailsScreen }
        />
      </FundSelectionNavigation.Group>
    </FundSelectionNavigation.Navigator>
  );
};

export default FundsScreen;