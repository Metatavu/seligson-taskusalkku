import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import strings from "../../../localization/strings";
import { useTheme } from "react-native-paper";
import FundTabsNavigator from "../../../types/navigators/fund-tabs";
import PassiveFundsScreen from "./passive-funds-screen";
import ActiveFundsScreen from "./active-funds-screen";
import InterestFundsScreen from "./interest-funds-screen";
import CombinationFundsScreen from "./combination-funds-screen";
import { ErrorContext } from "../../error-handler/error-handler";
import { Fund, FundGroup } from "../../../generated/client";
import { FundsApiContext } from "../../providers/funds-api-provider";

/**
 * Fund tabs screen navigation
 */
const FundTabsNavigation = createMaterialTopTabNavigator<FundTabsNavigator.Routes>();

/**
 * Fund tabs screen component
 */
const FundTabsScreen: React.FC = () => {
  const { colors } = useTheme();

  const errorContext = React.useContext(ErrorContext);
  const fundsApiContext = React.useContext(FundsApiContext);

  const [ funds, setFunds ] = React.useState<Fund[]>([]);

  /**
   * Loads funds from API
   */
  const loadFunds = async () => {
    try {
      /** TODO: add pagination support */
      setFunds(await fundsApiContext.listFunds({ maxResults: 200 }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.funds.list, error);
    }
  };

  /**
   * Effect for loading funds
   */
  React.useEffect(() => { loadFunds(); }, []);

  /**
   * Passive funds
   */
  const filteredFundsPassive = () => (
    <PassiveFundsScreen
      key="passiveFundsScreen"
      funds={ funds.filter(fund => fund.group === FundGroup.Passive) }
    />
  );

  /**
   * Active funds
   */
  const filteredFundsActive = () => (
    <ActiveFundsScreen
      key="activeFundsScreen"
      funds={ funds.filter(fund => fund.group === FundGroup.Active) }
    />
  );

  /**
   * Interest funds
   */
  const filteredFundsInterest = () => (
    <InterestFundsScreen
      key="interestFundsScreen"
      funds={ funds.filter(fund => fund.group === FundGroup.FixedIncome) }
    />
  );

  /**
   * Combination funds
   */
  const filteredFundsCombination = () => (
    <CombinationFundsScreen
      key="combinationFundsScreen"
      funds={ funds.filter(fund => fund.group === FundGroup.Balanced) }
    />
  );

  return (
    <FundTabsNavigation.Navigator
      initialRouteName="passiveFunds"
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
          fontSize: 10,
          textTransform: "none",
          flexWrap: "nowrap",
          fontFamily: "NotoSans_400Regular"
        }
      }}
    >
      <FundTabsNavigation.Screen
        name="passiveFunds"
        options={{ title: strings.screenTitles.passiveFunds }}
      >
        { filteredFundsPassive }
      </FundTabsNavigation.Screen>
      <FundTabsNavigation.Screen
        name="activeFunds"
        options={{ title: strings.screenTitles.activeFunds }}
      >
        { filteredFundsActive }
      </FundTabsNavigation.Screen>
      <FundTabsNavigation.Screen
        name="interestFunds"
        options={{ title: strings.screenTitles.interestFunds }}
      >
        { filteredFundsInterest }
      </FundTabsNavigation.Screen>
      <FundTabsNavigation.Screen
        name="combinationFunds"
        options={{ title: strings.screenTitles.combinationFunds }}
      >
        { filteredFundsCombination }
      </FundTabsNavigation.Screen>
    </FundTabsNavigation.Navigator>
  );
};

export default FundTabsScreen;