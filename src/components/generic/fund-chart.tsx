import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Fund } from "../../generated/client/models/Fund";
import styles from "../../styles/generic/fund-chart";
import strings from "../../localization/strings";
import { ErrorContext } from "../error-handler/error-handler";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { HistoricalValue } from "../../generated/client";
import { ChartRange } from "../../types";
import ChartUtils from "../../utils/chart";
import { VictoryChart, VictoryAxis, VictoryArea } from "victory-native";
import moment from "moment";
import Config from "../../app/config";
import TestData from "../../resources/test-data";
import theme from "../../theme";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
}

/**
 * Fund chart component
 *
 * @param props component properties
 */
const FundChart: React.FC<Props> = ({ fund }) => {
  const { color } = fund;
  const errorContext = React.useContext(ErrorContext);
  const auth = useAppSelector(selectAuth);

  const [ loading, setLoading ] = React.useState(true);
  const [ historicalValues, setHistoricalValues ] = React.useState<HistoricalValue[] | undefined>();
  const [ selectedRange, setSelectedRange ] = React.useState<ChartRange>(ChartRange.MONTH);

  /**
   * Loads fund history
   */
  const loadFundHistory = async () => {
    if (!auth || !fund.id) {
      return;
    }

    if (Config.getStatic().developmentBuild) {
      setHistoricalValues(TestData.getTestHistoricalValues(365));
      setLoading(false);
      return;
    }

    try {
      const historyData = await Api.getFundsApi(auth).listHistoricalValues({
        fundId: fund.id,
        startDate: ChartUtils.getStartDate(selectedRange),
        endDate: moment().toDate()
      });
      setHistoricalValues(historyData);
    } catch (error) {
      errorContext.setError("Error while loading fund history", error);
    }

    setLoading(false);
  };

  React.useEffect(() => { loadFundHistory(); }, []);

  /**
   * Event handler for date range change
   *
   * @param range selected chart range
   */
  const onDateRangeChange = (range: ChartRange) => () => {
    setSelectedRange(range);
    setLoading(true);
    loadFundHistory();
  };

  /**
   * Date range button
   *
   * @param range chart range
   * @param title display title
   * @param icon icon
   */
  const renderDateRangeButton = (range: ChartRange, title: string, icon?: string) => {
    return (
      <Button
        icon={ icon }
        uppercase={ false }
        compact
        onPress={ onDateRangeChange(range) }
        style={ selectedRange === range ? styles.dateRangeButtonSelected : styles.dateRangeButton }
      >
        <Text style={ selectedRange === range ? styles.dateRangeButtonTextSelected : styles.dateRangeButtonText }>
          { title }
        </Text>
      </Button>
    );
  };

  /**
   * Renders chart
   */
  const renderChart = () => {
    if (!historicalValues) {
      return null;
    }

    return (
      <VictoryChart
        scale={{ x: "time" }}
        domain={{ x: [ ChartUtils.getStartDate(selectedRange), moment().toDate() ] }}
        domainPadding={{ x: [ -22, 0 ] }}
        padding={ 35 }
      >
        <VictoryArea
          style={{
            data: {
              stroke: color,
              strokeWidth: 1,
              fill: color,
              fillOpacity: 0.3
            }
          }}
          animate={{
            duration: 200,
            onLoad: { duration: 500 }
          }}
          data={ ChartUtils.convertToVictoryChartData(historicalValues) }
        />
        <VictoryAxis
          scale={{ x: "time" }}
          style={{
            grid: { stroke: "lightgrey" },
            tickLabels: { fontSize: 10 }
          }}
          tickFormat={ xValue => ChartUtils.getDisplayDate(xValue, "DD.MM.YYYY") }
        />
        <VictoryAxis
          dependentAxis
          style={{
            grid: { stroke: "lightgrey" },
            tickLabels: { fontSize: 10 }
          }}
        />
      </VictoryChart>
    );
  };

  /**
   * Renders content
   */
  const renderContent = () => {
    if (loading) {
      return (
        <View style={ styles.loaderContainer }>
          <ActivityIndicator size="large" color={ theme.colors.primary }/>
        </View>
      );
    }

    return renderChart();
  };

  /**
   * Component render
   */
  return (
    <View style={{ minHeight: 353 }}>
      <View style={ styles.dateRangeButtonRow }>
        { renderDateRangeButton(ChartRange.MONTH, strings.fundCard.historyOneMonth) }
        { renderDateRangeButton(ChartRange.YEAR, strings.fundCard.historyOneYear) }
        { renderDateRangeButton(ChartRange.THREE_YEARS, strings.fundCard.historyThreeYears) }
        { renderDateRangeButton(ChartRange.FIVE_YEARS, strings.fundCard.historyFiveYears) }
        { renderDateRangeButton(ChartRange.TEN_YEARS, strings.fundCard.historyTenYears) }
        { renderDateRangeButton(ChartRange.MAX, strings.fundCard.historyMax) }
        <Button icon="calendar" color="#fff"/>
      </View>
      { renderContent() }
    </View>
  );
};

export default FundChart;