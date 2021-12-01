import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { Portfolio, PortfolioHistoryValue, PortfolioSummary } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import styles from "../../../styles/screens/portfolio/statistics-screen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DataChart from "../../generic/data-chart";
import moment from "moment";
import { ChartRange } from "../../../types";
import ChartUtils from "../../../utils/chart";
import { LinearGradient } from "expo-linear-gradient";
import Calculations from "../../../utils/calculations";
import { useIsFocused } from "@react-navigation/native";
import { PortfolioContext } from "./portfolio-context-provider";
import PortfolioSelect from "./portfolio-select";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import theme from "../../../theme";

/**
 * Statistics screen
 */
const StatisticsScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);
  const portfolioContext = React.useContext(PortfolioContext);
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const focus = useIsFocused();

  const [ loading, setLoading ] = React.useState(true);
  const [ historicalDataLoading, setHistoricalDataLoading ] = React.useState(true);
  const [ portfolios, setPortfolios ] = React.useState<Portfolio[]>([]);
  const [ selectedPortfolio, setSelectedPortfolio ] = React.useState<Portfolio>();
  const [ summaries, setSummaries ] = React.useState<PortfolioSummary[]>([]);
  const [ historicalData, setHistoricalData ] = React.useState<PortfolioHistoryValue[]>([]);
  const [ range, setRange ] = React.useState<ChartRange>(ChartRange.MONTH);

  /**
   * Loads fund history
   *
   * @param range chart range
   */
  const loadHistoryData = async () => {
    setHistoricalDataLoading(true);

    try {
      if (selectedPortfolio && selectedPortfolio.id) {
        setHistoricalData(
          await portfoliosApiContext.listPortfolioHistoryValues({
            portfolioId: selectedPortfolio.id,
            startDate: ChartUtils.getStartDate(range),
            endDate: moment().toDate()
          }, range)
        );
      } else {
        const list = await Promise.all(
          portfolios.map(portfolio =>
            portfoliosApiContext.listPortfolioHistoryValues({
              portfolioId: portfolio.id!,
              startDate: ChartUtils.getStartDate(range),
              endDate: moment().toDate()
            }, range))
        );

        setHistoricalData(ChartUtils.aggregateHistoricalData(list));
      }
    } catch (error) {
      errorContext.setError(strings.errorHandling.fundHistory.list, error);
    }

    setHistoricalDataLoading(false);
  };

  /**
   * Loads own funds
   */
  const loadOwnFunds = async () => {
    setLoading(true);

    try {
      const allPortfolios = await portfoliosApiContext.listPortfolios();

      const allSummaries = await Promise.all(
        allPortfolios.map(portfolio => (
          portfoliosApiContext.getPortfolioHSummary({
            portfolioId: portfolio.id!,
            startDate: ChartUtils.getStartDate(range),
            endDate: moment().toDate()
          })
        ))
      );

      setPortfolios(allPortfolios);
      setSummaries(allSummaries);
      loadHistoryData();
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list);
    }

    setLoading(false);
  };

  /**
   * Effect for loading history data when selected portfolio or chart range changes
   */
  React.useEffect(() => {
    loadHistoryData();
  }, [ selectedPortfolio, range ]);

  /**
   * Effect for setting selected portfolio when selected portfolio changes in portfolio context
   */
  React.useEffect(() => {
    setSelectedPortfolio(portfolioContext.selectedPortfolio);
  }, [ portfolioContext.selectedPortfolio ]);

  /**
   * Effect for loading own funds when this screen gets focused
   */
  React.useEffect(() => {
    focus && loadOwnFunds();
  }, [ focus ]);

  /**
   * Renders total
   */
  const renderTotal = () => {
    const filteredPortfolios = selectedPortfolio ?
      portfolios.filter(portfolio => portfolio.id === selectedPortfolio.id) :
      portfolios;
    const {
      marketValueTotal,
      purchaseTotal,
      totalChangeAmount,
      totalChangePercentage
    } = Calculations.getTotalPortfolioInfo(filteredPortfolios);

    return (
      <View style={ styles.totalContent }>
        <View style={ styles.totalTextContainer }>
          <Text style={ styles.totalTitle }>
            { selectedPortfolio?.id || strings.portfolio.select.all }
          </Text>
          <Text style={ styles.totalText }>
            <Icon name="briefcase-outline" size={ 26 } color="white"/>
            { ` ${marketValueTotal || 0} €` }
          </Text>
        </View>
        <Icon name="tune" size={ 26 } style={ styles.filterIcon }/>
        <View style={ styles.totalPurchaseContainer }>
          <View>
            <Text style={ styles.purchaseText }>
              { strings.portfolio.statistics.purchaseTotal }
            </Text>
            <Text style={ styles.purchasevalue }>
              { `${purchaseTotal} €` }
            </Text>
          </View>
          <View>
            <Text style={ styles.purchaseText }>
              { strings.portfolio.statistics.change }
            </Text>
            <Text style={ styles.purchasevalue }>
              { `${totalChangeAmount} € | ${totalChangePercentage}%` }
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renders chart
   */
  const renderChart = () => (
    <View style={{ width: "100%" }}>
      <DataChart
        data={ historicalData }
        loading={ historicalDataLoading }
        selectedRange={ range }
        onRangeChange={ setRange }
      />
    </View>
  );

  /**
   * Renders info row
   *
   * @param title row title
   * @param value row value
   */
  const renderInfoRow = (title: string, value: string) => (
    <View style={ styles.infoRow }>
      <Text style={ styles.infoRowTitle }>
        { title }
      </Text>
      <Text style={ styles.infoRowValue }>
        { value }
      </Text>
    </View>
  );

  /**
   * Renders info
   *
   * TODO: Add summary filter when API spec includes portfolio ID for summaries
   */
  const renderInfo = () => {
    if (!historicalData.length) {
      return null;
    }

    const currentValue = historicalData[historicalData.length - 1].value;
    const purchaseValue = historicalData[0].value;
    const totalChangeAmount = Calculations.getTotalChangeAmount(purchaseValue, currentValue);
    const totalChangePercentage = Calculations.getTotalChangePercentage(purchaseValue, currentValue);
    const [ subscriptionsSum, redemptionsSum ] = Calculations.getPortfolioSummaryInfo(summaries);

    return (
      <View style={ styles.infoContainer }>
        { renderInfoRow(strings.portfolio.statistics.totalChange, `${totalChangeAmount} € | ${totalChangePercentage}%`) }
        { renderInfoRow(strings.portfolio.statistics.subscriptions, `${subscriptionsSum} €`) }
        { renderInfoRow(strings.portfolio.statistics.redemptions, `${redemptionsSum} €`) }
        { renderInfoRow(strings.portfolio.statistics.total, currentValue?.toString() || "0") }
      </View>
    );
  };

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
      <View style={ styles.viewContainer }>
        <PortfolioSelect/>
        <LinearGradient
          colors={[ "transparent", "rgba(0,0,0,0.5)" ]}
        />
        <View style={ styles.totalContainer }>
          { renderTotal() }
        </View>
        <View style={ styles.cardWrapper }>
          <View>
            { renderChart() }
          </View>
          { renderInfo() }
        </View>
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <ScrollView>
      { renderContent() }
    </ScrollView>
  );
};

export default StatisticsScreen;