import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, IconButton } from "react-native-paper";
import styles from "../../styles/generic/fund-chart";
import strings from "../../localization/strings";
import { FundHistoryValue, PortfolioHistoryValue } from "../../generated/client";
import { ChartRange } from "../../types";
import ChartUtils from "../../utils/chart";
import { VictoryChart, VictoryAxis, VictoryArea } from "victory-native";
import moment from "moment";
import theme from "../../theme";

/**
 * Component properties
 */
interface Props {
  data: (FundHistoryValue | PortfolioHistoryValue)[];
  loading: boolean;
  selectedRange: ChartRange;
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
  selectedRange,
  color,
  onRangeChange
}) => {
  /**
   * Date range button
   *
   * @param range chart range
   * @param title display title
   */
  const renderDateRangeButton = (range: ChartRange, title: string) => {
    const selected = selectedRange === range;

    return (
      <Button
        mode="outlined"
        uppercase={ false }
        compact
        onPress={ () => onRangeChange(range) }
        style={[ styles.dateRangeButton, selected && styles.dateRangeButtonSelected ]}
        labelStyle={[ styles.dateRangeButtonText, selected && styles.dateRangeButtonTextSelected ]}
        color="white"
      >
        { title }
      </Button>
    );
  };

  /**
   * Render range selection
   */
  const renderRangeSelection = () => (
    <View style={ styles.dateRangeButtonRow }>
      { renderDateRangeButton(ChartRange.MONTH, strings.fundCard.historyOneMonth) }
      { renderDateRangeButton(ChartRange.YEAR, strings.fundCard.historyOneYear) }
      { renderDateRangeButton(ChartRange.THREE_YEARS, strings.fundCard.historyThreeYears) }
      { renderDateRangeButton(ChartRange.FIVE_YEARS, strings.fundCard.historyFiveYears) }
      { renderDateRangeButton(ChartRange.TEN_YEARS, strings.fundCard.historyTenYears) }
      { renderDateRangeButton(ChartRange.MAX, strings.fundCard.historyMax) }
      <IconButton icon="calendar" color="#fff" style={{ maxWidth: 25 }}/>
    </View>
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
        top: 10,
        bottom: 30,
        left: 50,
        right: 60
      }}
    >
      <VictoryArea
        style={{
          data: {
            stroke: color || "#74CBE8",
            strokeWidth: 0.5,
            fill: color || "#74CBE8",
            fillOpacity: 0.2
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
    <>
      { renderRangeSelection() }
      { renderContent() }
    </>
  );
};

export default DataChart;