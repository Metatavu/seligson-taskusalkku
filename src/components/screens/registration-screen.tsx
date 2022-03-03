import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegistrationNavigator from "../../types/navigators/registration";
import PortfolioScreen from "./portfolio/portfolio-tabs-screen";
import FundsScreen from "./home/funds-screen";
import PublicationsScreen from "./home/publications-screen";
import MeetingsScreen from "./home/meetings-screen";
import LanguageSelectionScreen from "./registration/language-selection-screen";

/**
 * Registration screen navigation
 */
const RegistrationNavigation = createNativeStackNavigator<RegistrationNavigator.Routes>();

/**
 * Registration screen component
 */
const RegistrationScreen: React.FC = () => (
  <RegistrationNavigation.Navigator
    initialRouteName="languageSelection"
    screenOptions={{ headerShown: false }}
  >
    <RegistrationNavigation.Screen
      name="languageSelection"
      component={ LanguageSelectionScreen }
    />
    <RegistrationNavigation.Screen
      name="basicInfo"
      component={ PortfolioScreen }
    />
    <RegistrationNavigation.Screen
      name="taxLiabilityInfo"
      component={ FundsScreen }
    />
    <RegistrationNavigation.Screen
      name="mandatoryCustomerInfo"
      component={ PublicationsScreen }
    />
    <RegistrationNavigation.Screen
      name="consents"
      component={ MeetingsScreen }
    />
  </RegistrationNavigation.Navigator>
);

export default RegistrationScreen;