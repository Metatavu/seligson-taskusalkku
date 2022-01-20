import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import DataChart from "../../generic/data-chart";
import FundDetails from "../../generic/fund-details";
import { useNavigation, useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import { Button, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/funds/funds-details-screen";
import { ChartRange, VictoryChartData } from "../../../types";
import { ErrorContext } from "../../error-handler/error-handler";
import theme from "../../../theme";
import ChartUtils from "../../../utils/chart";
import TestData from "../../../resources/test-data";
import Calculations from "../../../utils/calculations";

/**
 * Fund details screen component
 */
const FundDetailsScreen: React.FC = () => {
  const { params } = useRoute<FundsNavigator.RouteProps<"fundDetails">>();
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);
  const fund = params?.fund;

  const [ loading, setLoading ] = React.useState(true);
  const [ selectedRange, setSelectedRange ] = React.useState(ChartRange.MONTH);
  const [ historicalData, setHistoricalData ] = React.useState<VictoryChartData[]>([]);

  if (!fund) {
    return null;
  }

  /**
   * Loads fund history
   *
   * @param range selected chart range or month as default
   */
  const loadHistoryData = async () => {
    if (!fund.id) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Add security history values
      setHistoricalData([]);
    } catch (error) {
      errorContext.setError(strings.errorHandling.fundHistory.list, error);
    }

    setLoading(false);
  };

  /**
   * Effect for loading history data when selected fund changes
   */
  React.useEffect(() => { loadHistoryData(); }, [ fund, selectedRange ]);

  /**
   * Renders content
   */
  const renderContent = () => {
    if (loading) {
      return (
        <View>
          <ActivityIndicator size="large" color={ theme.colors.primary }/>
        </View>
      );
    }

    return (
      <>
        <View style={ styles.chart }>
          <DataChart
            data={ historicalData }
            loading={ loading }
            color={ fund.color }
            selectedRange={ selectedRange }
            onRangeChange={ setSelectedRange }
          />
        </View>
        <View style={ styles.detailsWrapper }>
          <FundCard fund={ fund }/>
          <FundDetails fund={ fund }/>
        </View>
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <>
      <Button
        icon="arrow-left-circle"
        onPress={ navigation.goBack }
        labelStyle={{ color: "#fff" }}
        style={ styles.backButton }
      >
        <Text style={{ color: "#fff" }}>
          { strings.generic.back }
        </Text>
      </Button>
      <ScrollView>
        { renderContent() }
      </ScrollView>
    </>
  );
};

export default FundDetailsScreen;