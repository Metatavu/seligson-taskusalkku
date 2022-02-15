import React from "react";
import { GestureResponderEvent, ScrollView, View, ActivityIndicator } from "react-native";
import { Paragraph, Title } from "react-native-paper";
import { PortfolioHistoryValue, PortfolioSummary } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import styles from "../../../styles/screens/portfolio/statistics-screen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ChartRangeSelector from "../../generic/chart-range-selector";
import { ChartRange } from "../../../types";
import ChartUtils from "../../../utils/chart";
import { LinearGradient } from "expo-linear-gradient";
import Calculations from "../../../utils/calculations";
import { useIsFocused } from "@react-navigation/native";
import { PortfolioContext } from "../../providers/portfolio-provider";
import PortfolioSelect from "./portfolio-select";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import theme from "../../../theme";
import HistoryValueChart from "../../generic/history-value-chart";

/**
 * Statistics screen component
 */
const StatisticsScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);
  const { portfolios, selectedPortfolio, getEffectivePortfolios } = React.useContext(PortfolioContext);
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const focus = useIsFocused();

  const [ loading, setLoading ] = React.useState(true);
  const [ historyLoading, setHistoryLoading ] = React.useState(false);
  const [ summaries, setSummaries ] = React.useState<PortfolioSummary[]>();
  const [ historyValues, setHistoryValues ] = React.useState<PortfolioHistoryValue[]>();
  const [ selectedRange, setSelectedRange ] = React.useState<Date[] | ChartRange>(ChartRange.MAX);
  const [ scrollEnabled, setScrollEnabled ] = React.useState(true);

  /**
   * Loads fund history
   *
   * @param range chart range
   */
  const loadHistoryData = async () => {
    setHistoryLoading(true);

    const { startDate, endDate } = ChartUtils.getDateFilters(selectedRange);

    try {
      const portfolioHistoryValues = await Promise.all(
        getEffectivePortfolios().map(portfolio => (
          portfoliosApiContext.listPortfolioHistoryValues({
            portfolioId: portfolio.id!,
            startDate: startDate,
            endDate: endDate
          })
        ))
      );

      // TODO: Add support for securities dropdown selection
      setHistoryValues(ChartUtils.getAggregatedHistoryValues(portfolioHistoryValues));
    } catch (error) {
      errorContext.setError(strings.errorHandling.fundHistory.list, error);
    }

    setHistoryLoading(false);
  };

  /**
   * Load portfolio summaries
   */
  const loadSummaries = async () => {
    !summaries && setLoading(true);

    try {
      const portfolioSummaries = await Promise.all(
        getEffectivePortfolios().map(({ id }) => (
          portfoliosApiContext.getPortfolioSummary({
            portfolioId: id!,
            ...ChartUtils.getDateFilters(selectedRange)
          })
        ))
      );

      setSummaries(portfolioSummaries);
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }

    setLoading(false);
  };

  /**
   * Toggles scrolling
   *
   * @param enabled enabled
   */
  const toggleScroll = (enabled: boolean) => (event: GestureResponderEvent) => {
    setScrollEnabled(enabled);
    event.preventDefault();
  };

  /**
   * Effect for loading history data when selected portfolio or chart range changes
   */
  React.useEffect(() => {
    loadHistoryData();
    loadSummaries();
  }, [ selectedPortfolio, selectedRange ]);

  /**
   * Effect for loading own funds when this screen gets focused
   */
  React.useEffect(() => {
    if (focus) {
      loadHistoryData();
      loadSummaries();
    }
  }, [ focus, portfolios ]);

  /**
   * Renders chart
   */
  const renderChart = () => {
    if (historyLoading) {
      return (
        <View style={ styles.chartLoaderContainer }>
          <ActivityIndicator size="large" color={ theme.colors.primary }/>
        </View>
      );
    }

    return (
      <HistoryValueChart
        historyValues={ historyValues || [] }
        color={ theme.colors.primary }
        currency="EUR"
        onChartTouch={ toggleScroll(false) }
      />
    );
  };

  /**
   * Renders info row
   *
   * @param title row title
   * @param value row value
   */
  const renderDetailRow = (title: string, value: string) => (
    <View style={ styles.detailRow }>
      <Paragraph style={ styles.detailRowTitle }>
        { title }
      </Paragraph>
      <Paragraph style={ styles.detailRowValue }>
        { value }
      </Paragraph>
    </View>
  );

  /**
   * Renders total details
   */
  const renderTotalDetails = () => {
    if (!historyValues?.length) {
      return null;
    }

    const {
      marketValueTotal,
      purchaseTotal,
      totalChangeAmount,
      totalChangePercentage
    } = Calculations.getTotalPortfolioInfo(getEffectivePortfolios());

    return (
      <View>
        <View
          style={ styles.details }
          onTouchStart={ toggleScroll(true) }
        >
          <View style={[ styles.overviewRow, { justifyContent: "center" } ]}>
            <Icon
              name="briefcase-outline"
              color={ theme.colors.primary }
              size={ 26 }
              style={ styles.totalIcon }
            />
            <Title style={{ color: theme.colors.primary }}>
              { marketValueTotal }
            </Title>
          </View>
          { renderDetailRow(strings.portfolio.statistics.purchaseTotal, purchaseTotal) }
          { renderDetailRow(strings.portfolio.statistics.change, `${totalChangeAmount}  |  ${totalChangePercentage}`) }
        </View>
      </View>
    );
  };

  /**
   * Renders history details
   */
  const renderHistoryDetails = () => {
    if (!historyValues?.length) {
      return null;
    }

    const dates = ChartUtils.getDisplayDates(selectedRange);

    const {
      totalChangeAmount,
      totalChangePercentage
    } = Calculations.getTotalPortfolioHistoryInfo(historyValues);

    const {
      subscriptionsTotal,
      redemptionsTotal,
      difference
    } = Calculations.getPortfolioSummaryInfo(summaries || []);

    return (
      <View>
        { renderDetailRow(strings.portfolio.statistics.changeInGivenRange, `${dates.startDate} - ${dates.endDate}`) }
        { renderDetailRow(strings.portfolio.statistics.totalChange, `${totalChangeAmount}  |  ${totalChangePercentage}`) }
        { renderDetailRow(strings.portfolio.statistics.subscriptions, subscriptionsTotal) }
        { renderDetailRow(strings.portfolio.statistics.redemptions, redemptionsTotal) }
        { renderDetailRow(strings.portfolio.statistics.total, difference) }
      </View>
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

    return (
      <ScrollView
        style={ styles.scrollView }
        contentContainerStyle={ styles.scrollContentContainer }
        scrollEnabled={ scrollEnabled }
      >
        <View
          style={ styles.overview }
          onTouchStart={ toggleScroll(true) }
        >
          <PortfolioSelect/>
          { renderTotalDetails() }
        </View>
        <View style={ styles.chartAndDetailsWrapper }>
          <View style={ !scrollEnabled ? styles.focused : styles.notFocused }>
            <ChartRangeSelector
              selectedRange={ selectedRange }
              loading={ loading }
              onDateRangeChange={ setSelectedRange }
            />
            { renderChart() }
          </View>
          <View
            style={ styles.historyDetails }
            onTouchStart={ toggleScroll(true) }
          >
            { renderHistoryDetails() }
          </View>
        </View>
      </ScrollView>
    );
  };

  /**
   * Component render
   */
  return (
    <LinearGradient
      colors={[ "transparent", "rgba(0,0,0,0.1)" ]}
      style={ styles.gradientWrapper }
    >
      { renderContent() }
    </LinearGradient>
  );
};

export default StatisticsScreen;