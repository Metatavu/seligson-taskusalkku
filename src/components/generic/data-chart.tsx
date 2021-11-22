import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Button } from "react-native-paper";
import styles from "../../styles/generic/fund-chart";
import strings from "../../localization/strings";
import { HistoricalValue, PortfolioHistoryValue } from "../../generated/client";
import { ChartRange } from "../../types";
import ChartUtils from "../../utils/chart";
import { VictoryChart, VictoryAxis, VictoryArea } from "victory-native";
import moment from "moment";
import theme from "../../theme";

/**
 * Component properties
 */
interface Props {
  data: (HistoricalValue | PortfolioHistoryValue)[];
  loading: boolean;
  color?: string;
  onRangeChange: (range: ChartRange) => void;
}

/**
 * Data chart component
 *
 * @param props component properties
 */
const DataChart: React.FC<Props> = ({
  data,
  loading,
  color,
  onRangeChange
}) => {
  const [ selectedRange, setSelectedRange ] = React.useState(ChartRange.MONTH);

  /**
   * Event handler for date range change
   *
   * @param range selected chart range
   */
  const onDateRangeChange = (range: ChartRange) => () => {
    setSelectedRange(range);
  };

  /**
   * Effect for calling onRangeChange when selectedRange has changed to state
   */
  React.useEffect(() => { onRangeChange(selectedRange); }, [ selectedRange ]);

  /**
   * Date range button
   *
   * @param range chart range
   * @param title display title
   */
  const renderDateRangeButton = (range: ChartRange, title: string) => (
    <Button
      uppercase={ false }
      compact
      onPress={ onDateRangeChange(range) }
      style={ selectedRange === range ? styles.dateRangeButtonSelected : styles.dateRangeButton }
      labelStyle={ selectedRange === range ? styles.dateRangeButtonTextSelected : styles.dateRangeButtonText }
    >
      { title }
    </Button>
  );

  /**
   * Renders chart
   */
  const renderChart = () => (
    <VictoryChart
      scale={{ x: "time" }}
      domain={{ x: [ ChartUtils.getStartDate(selectedRange), moment().toDate() ] }}
      domainPadding={{ x: [ -22, 0 ] }}
      padding={{
        left: 40,
        right: 40,
        bottom: 40
      }}
    >
      <VictoryArea
        style={{
          data: {
            stroke: color || "#74CBE8",
            strokeWidth: 0.5,
            fill: color || "#74CBE8",
            fillOpacity: 0.3
          }
        }}
        animate={{
          duration: 200,
          onLoad: { duration: 500 }
        }}
        data={ ChartUtils.convertToVictoryChartData(data) }
      />
      <VictoryAxis
        scale={{ x: "time" }}
        style={{
          grid: { stroke: "lightgrey" },
          tickLabels: { fontSize: 10, fill: "white" },
          axis: { strokeWidth: 0 }
        }}
        tickFormat={ xValue => ChartUtils.getDisplayDate(xValue, "DD.MM.YYYY") }
      />
      <VictoryAxis
        dependentAxis
        style={{
          grid: { stroke: "lightgrey" },
          tickLabels: { fontSize: 10, fill: "white" },
          axis: { strokeWidth: 0 }
        }}
        tickFormat={ yValue => `${yValue} €` }
      />
    </VictoryChart>
  );

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
    <View style={ styles.chartContainer }>
      <View style={ styles.dateRangeButtonRow }>
        { renderDateRangeButton(ChartRange.MONTH, strings.fundCard.historyOneMonth) }
        { renderDateRangeButton(ChartRange.YEAR, strings.fundCard.historyOneYear) }
        { renderDateRangeButton(ChartRange.THREE_YEARS, strings.fundCard.historyThreeYears) }
        { renderDateRangeButton(ChartRange.FIVE_YEARS, strings.fundCard.historyFiveYears) }
        { renderDateRangeButton(ChartRange.TEN_YEARS, strings.fundCard.historyTenYears) }
        { renderDateRangeButton(ChartRange.MAX, strings.fundCard.historyMax) }
        <Button icon="calendar" color="#fff" compact style={{ maxWidth: 25 }}/>
      </View>
      { renderContent() }
    </View>
  );
};

export default DataChart;