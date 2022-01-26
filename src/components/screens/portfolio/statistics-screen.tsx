import React from "react";
import { ScrollView, View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { PortfolioHistoryValue, PortfolioSummary } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import styles from "../../../styles/screens/portfolio/statistics-screen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DataChart from "../../generic/data-chart";
import { ChartRange } from "../../../types";
import ChartUtils from "../../../utils/chart";
import { LinearGradient } from "expo-linear-gradient";
import Calculations from "../../../utils/calculations";
import { useIsFocused } from "@react-navigation/native";
import { PortfolioContext } from "../../providers/portfolio-provider";
import PortfolioSelect from "./portfolio-select";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import theme from "../../../theme";

/**
 * Statistics screen component
 */
const StatisticsScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);
  const { selectedPortfolio, getEffectivePortfolios } = React.useContext(PortfolioContext);
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const focus = useIsFocused();

  const [ loading, setLoading ] = React.useState(true);
  const [ historicalDataLoading, setHistoricalDataLoading ] = React.useState(true);
  const [ summaries, setSummaries ] = React.useState<PortfolioSummary[]>();
  const [ historicalData, setHistoricalData ] = React.useState<PortfolioHistoryValue[]>();
  const [ selectedRange, setSelectedRange ] = React.useState<Date[] | ChartRange>(ChartRange.MONTH);

  /**
   * Loads fund history
   *
   * @param range chart range
   */
  const loadHistoryData = async () => {
    !historicalData && setHistoricalDataLoading(true);

    const { startDate, endDate } = ChartUtils.getDateFilters(selectedRange);

    try {
      const portfolioHistoryValues = await Promise.all(
        getEffectivePortfolios().map(portfolio => (
          portfoliosApiContext.listPortfolioHistoryValues({
            portfolioId: portfolio.id!,
            startDate: startDate,
            endDate: endDate
          }, selectedRange)
        ))
      );

      const skipValue = ChartUtils.getSkipValue(selectedRange);
      const allValues: PortfolioHistoryValue[] = [];

      portfolioHistoryValues.forEach(values => (
        allValues.push(...Calculations.aggregateList(values, skipValue))
      ));

      // TODO: Add support for securities dropdown selection
      setHistoricalData(allValues);
    } catch (error) {
      errorContext.setError(strings.errorHandling.fundHistory.list, error);
    }

    setHistoricalDataLoading(false);
  };

  /**
   * Loads own funds
   */
  const loadSummaries = async () => {
    !summaries && setLoading(true);

    const { startDate, endDate } = ChartUtils.getDateFilters(selectedRange);

    try {
      const portfolioSummaries = await Promise.all(
        getEffectivePortfolios().map(({ id }) => (
          portfoliosApiContext.getPortfolioSummary({
            portfolioId: id!,
            startDate: startDate,
            endDate: endDate
          })
        ))
      );

      setSummaries(portfolioSummaries);
      loadHistoryData();
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }

    setLoading(false);
  };

  /**
   * Effect for loading history data when selected portfolio or chart range changes
   */
  React.useEffect(() => {
    loadHistoryData();
  }, [ selectedPortfolio, selectedRange ]);

  /**
   * Effect for loading own funds when this screen gets focused
   */
  React.useEffect(() => {
    if (focus) {
      loadSummaries();
    }
  }, [ focus ]);

  /**
   * Renders chart
   */
  const renderChart = () => (
    <View style={ styles.chart }>
      <DataChart
        data={ ChartUtils.convertToVictoryChartData(historicalData || []) }
        loading={ historicalDataLoading }
        selectedRange={ selectedRange }
        onDateRangeChange={ setSelectedRange }
      />
    </View>
  );

  /**
   * Renders info row
   *
   * @param title row title
   * @param value row value
   */
  const renderDetailRow = (title: string, value: string) => (
    <View style={ styles.detailRow }>
      <Text style={ styles.detailRowTitle }>
        { title }
      </Text>
      <Text style={ styles.detailRowValue }>
        { value }
      </Text>
    </View>
  );

  /**
   * Renders details
   *
   * TODO: Add summary filter when API spec includes portfolio ID for summaries
   */
  const renderDetails = () => {
    if (!historicalData?.length) {
      return null;
    }

    const currentValue = historicalData[historicalData.length - 1].value;
    const purchaseValue = historicalData[0].value;

    const totalChangeAmount = Calculations.formatNumberStr(
      Calculations.getTotalChangeAmount(purchaseValue, currentValue),
      2,
      { suffix: " €" }
    );

    const totalChangePercentage = Calculations.formatNumberStr(
      Calculations.getTotalChangePercentage(purchaseValue, currentValue),
      2,
      { suffix: " %" }
    );

    const [ subscriptionsSum, redemptionsSum ] = Calculations.getPortfolioSummaryInfo(summaries || []);
    const totalSubscriptions = Calculations.formatNumberStr(subscriptionsSum, 2, { suffix: " €" });
    const totalRedemptions = Calculations.formatNumberStr(redemptionsSum, 2, { suffix: " €" });
    const totalValue = Calculations.formatNumberStr(currentValue || "0", 2, { suffix: " €" });

    return (
      <View style={ styles.details }>
        { renderDetailRow(strings.portfolio.statistics.totalChange, `${totalChangeAmount}  |  ${totalChangePercentage}`) }
        { renderDetailRow(strings.portfolio.statistics.subscriptions, totalSubscriptions) }
        { renderDetailRow(strings.portfolio.statistics.redemptions, totalRedemptions) }
        { renderDetailRow(strings.portfolio.statistics.total, totalValue) }
      </View>
    );
  };

  /**
   * Renders overview
   */
  const renderOverview = () => {
    const {
      marketValueTotal,
      purchaseTotal,
      totalChangeAmount,
      totalChangePercentage
    } = Calculations.getTotalPortfolioInfo(getEffectivePortfolios());

    return (
      <View style={ styles.overview }>
        <PortfolioSelect/>
        <View style={[ styles.overviewRow, { justifyContent: "center" } ]}>
          <Icon name="briefcase-outline" size={ 26 } color="white" style={ styles.totalIcon }/>
          <Text style={[ styles.totalText ]}>
            { marketValueTotal }
          </Text>
        </View>
        <View style={[ styles.overviewRow, { justifyContent: "space-between" } ]}>
          <View>
            <Text style={ styles.purchaseText }>
              { strings.portfolio.statistics.purchaseTotal }
            </Text>
            <Text style={ styles.purchaseValue }>
              { purchaseTotal }
            </Text>
          </View>
          <View>
            <Text style={ styles.purchaseText }>
              { strings.portfolio.statistics.change }
            </Text>
            <Text style={ styles.purchaseValue }>
              { `${totalChangeAmount}  |  ${totalChangePercentage}` }
            </Text>
          </View>
        </View>
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
      >
        { renderOverview() }
        <View style={ styles.cardWrapper }>
          <View style={ styles.card }>
            { renderChart() }
            { renderDetails() }
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