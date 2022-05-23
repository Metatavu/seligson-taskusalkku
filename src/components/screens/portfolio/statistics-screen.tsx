import React from "react";
import { GestureResponderEvent, ScrollView, View, ActivityIndicator, Text } from "react-native";
import { Divider, Paragraph, Title } from "react-native-paper";
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
import DateUtils from "../../../utils/date-utils";
import { useHardwareGoBack } from "../../../app/hooks";
import CompanySelect from "./company-select";
import { CompanyContext } from "../../providers/company-provider";

/**
 * Statistics screen component
 */
const StatisticsScreen: React.FC = () => {
  useHardwareGoBack();
  const errorContext = React.useContext(ErrorContext);
  const { selectedCompany } = React.useContext(CompanyContext);

  const {
    portfolios,
    selectedPortfolio,
    getEffectivePortfolios,
    setStatisticsLoaderParams,
    savedHistoryValues,
    savedSummaries,
    saveHistoryValues,
    saveSummaries,
    statisticsLoaderParams
  } = React.useContext(PortfolioContext);

  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const focus = useIsFocused();

  const [ loading, setLoading ] = React.useState(true);
  const [ historyLoading, setHistoryLoading ] = React.useState(false);
  const [ summaries, setSummaries ] = React.useState<PortfolioSummary[]>();
  const [ historyValues, setHistoryValues ] = React.useState<PortfolioHistoryValue[]>();
  const [ selectedRange, setSelectedRange ] = React.useState<Date[] | ChartRange>(statisticsLoaderParams?.range || ChartRange.MAX);
  const [ scrollEnabled, setScrollEnabled ] = React.useState(true);

  /**
   * Loads history data
   */
  const loadHistoryData = async () => {
    if (savedHistoryValues.length > 0) {
      return savedHistoryValues;
    }

    const effectivePortfolios = getEffectivePortfolios(selectedCompany);

    if (!effectivePortfolios) return;

    setHistoryLoading(true);
    setHistoryValues(undefined);

    const { startDate, endDate } = DateUtils.getDateFilters(selectedRange);

    try {
      const portfolioHistoryValues = await Promise.all(
        effectivePortfolios.map(portfolio => (
          portfoliosApiContext.listPortfolioHistoryValues({
            portfolioId: portfolio.id!,
            startDate: startDate,
            endDate: endDate
          })
        ))
      );

      return ChartUtils.getAggregatedHistoryValues(portfolioHistoryValues);
    } catch (error) {
      errorContext.setError(strings.errorHandling.fundHistory.list, error);
    }

    setHistoryLoading(false);
  };

  /**
   * Load portfolio summaries
   */
  const loadSummaries = async () => {
    if (savedSummaries.length > 0) {
      return savedSummaries;
    }

    const effectivePortfolios = getEffectivePortfolios(selectedCompany);

    if (!effectivePortfolios) return;

    try {
      const portfolioSummaries = await Promise.all(
        effectivePortfolios.map(({ id }) => (
          portfoliosApiContext.getPortfolioSummary({
            portfolioId: id!,
            ...DateUtils.getDateFilters(selectedRange)
          })
        ))
      );

      return portfolioSummaries;
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }
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
   * Fetch component data
   */
  const fetchData = async () => {
    setStatisticsLoaderParams({ range: selectedRange, effectivePortfolios: getEffectivePortfolios(selectedCompany) });
    !summaries && setLoading(true);
    setHistoryLoading(true);

    const [ portfolioHistoryValues, portfolioSummaries ] = await Promise.all([
      loadHistoryData(),
      loadSummaries()
    ]);

    if (portfolioHistoryValues) {
      saveHistoryValues(portfolioHistoryValues);
      setHistoryValues(portfolioHistoryValues);
      setHistoryLoading(false);
    }

    if (portfolioSummaries) {
      saveSummaries(portfolioSummaries);
      setSummaries(portfolioSummaries);
      setLoading(false);
    }
  };

  /**
   * Effect for loading own funds when this screen gets focused
   */
  React.useLayoutEffect(() => {
    focus && fetchData();
  }, [ focus, portfolios, selectedPortfolio, selectedRange, selectedCompany ]);

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
    const {
      marketValueTotal,
      purchaseTotal,
      totalChangeAmount,
      totalChangePercentage
    } = Calculations.getTotalPortfolioInfo(getEffectivePortfolios(selectedCompany) || []);

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
   * Renders chart
   */
  const renderChart = () => {
    if (historyLoading || loading) {
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
   * Handles updating selected range
   * 
   * @param range 
   */
  const onRangeUpdate = (range: ChartRange | Date[]) => {
    saveSummaries([]);
    saveHistoryValues([]);
    setSelectedRange(range);
  };

  /**
   * Renders chart container
   */
  const renderChartContainer = () => {
    if (!!historyValues && !historyValues.length) {
      return (
        <View style={ styles.chartLoaderContainer }>
          <Text style={{ marginTop: 10 }}>
            { strings.portfolio.statistics.noSecurities }
          </Text>
        </View>
      );
    }

    return (
      <>
        <ChartRangeSelector
          selectedRange={ selectedRange }
          loading={ loading }
          onDateRangeChange={ range => onRangeUpdate(range) }
        />
        { renderChart() }
      </>
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
      subscriptionsTotal,
      redemptionsTotal,
      difference
    } = Calculations.getPortfolioSummaryInfo(summaries || []);

    const startDate = Calculations.isRangeDateBeforeValueStartDate(selectedRange, historyValues) ?
      historyValues[0].date && DateUtils.formatToFinnishDate(historyValues[0].date) :
      dates.startDate;

    return (
      <View>
        { renderDetailRow(strings.portfolio.statistics.changeInGivenRange, `${startDate} - ${dates.endDate}`) }
        { renderDetailRow(strings.portfolio.statistics.subscriptions, subscriptionsTotal) }
        { renderDetailRow(strings.portfolio.statistics.redemptions, `-${redemptionsTotal}`) }
        { renderDetailRow(strings.portfolio.statistics.total, difference) }
      </View>
    );
  };

  /**
   * Renders content
   */
  const renderContent = () => {
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
          <CompanySelect loading={ historyLoading }/>
          <Divider style={{ backgroundColor: "white" }}/>
          <PortfolioSelect loading={ historyLoading }/>
          { renderTotalDetails() }
        </View>
        <View style={ styles.chartAndDetailsWrapper }>
          <View style={ !scrollEnabled ? styles.focused : styles.notFocused }>
            { renderChartContainer() }
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