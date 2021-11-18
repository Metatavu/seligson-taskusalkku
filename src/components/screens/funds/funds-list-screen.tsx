import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import strings from "../../../localization/strings";
import { useTheme } from "react-native-paper";
import FundsNavigator from "../../../types/navigators/funds-list";
import PassiveFundsScreen from "./passive-funds-screen";
import ActiveFundsScreen from "./active-funds-screen";
import InterestFundsScreen from "./interest-funds-screen";
import CombinationFundsScreen from "./combination-funds-screen";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/auth-slice";
import Api from "../../../api/api";
import { ErrorContext } from "../../error-handler/error-handler";
import { Fund, FundGroup } from "../../../generated/client";

/**
 * Funds screen tab navigation
 */
const FundsNavigation = createMaterialTopTabNavigator<FundsNavigator.Routes>();

/**
 * Funds screen
 */
const FundsListScreen: React.FC = () => {
  const { colors } = useTheme();
  const auth = useAppSelector(selectAuth);
  const errorContext = React.useContext(ErrorContext);

  const [ funds, setFunds ] = React.useState<Fund[]>([]);

  /**
   * Loads funds from API
   */
  const loadFunds = async () => {
    if (!auth) {
      return;
    }

    try {
      /** TODO: add pagination support */
      setFunds(await Api.getFundsApi(auth).listFunds({ maxResults: 200 }));
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
        options={{ title: strings.screenTitles.passiveFunds }}
      >
        { filteredFundsPassive }
      </FundsNavigation.Screen>
      <FundsNavigation.Screen
        name="activeFunds"
        options={{ title: strings.screenTitles.activeFunds }}
      >
        { filteredFundsActive }
      </FundsNavigation.Screen>
      <FundsNavigation.Screen
        name="interestFunds"
        options={{ title: strings.screenTitles.interestFunds }}
      >
        { filteredFundsInterest }
      </FundsNavigation.Screen>
      <FundsNavigation.Screen
        name="combinationFunds"
        options={{ title: strings.screenTitles.combinationFunds }}
      >
        { filteredFundsCombination }
      </FundsNavigation.Screen>
    </FundsNavigation.Navigator>
  );
};

export default FundsListScreen;