import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import Api from "../../../api/api";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/auth-slice";
import { Portfolio, PortfolioHistoryValue } from "../../../generated/client";
import strings from "../../../localization/strings";
import TestData from "../../../resources/test-data";
import AuthUtils from "../../../utils/auth";
import { ErrorContext } from "../../error-handler/error-handler";
import styles from "../../../styles/screens/portfolio/statistics-screen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FundChart from "../../generic/data-chart";
import moment from "moment";
import { ChartRange } from "../../../types";
import ChartUtils from "../../../utils/chart";
import { LinearGradient } from "expo-linear-gradient";
import Calculations from "../../../utils/calculations";
import { useNavigation } from "@react-navigation/native";

/**
 * Statistics screen
 */
const StatisticsScreen: React.FC = () => {
  const auth = useAppSelector(selectAuth);
  const errorContext = React.useContext(ErrorContext);
  const navigation = useNavigation();

  const [ loading, setLoading ] = React.useState(true);
  const [ selectedPortfolio, setSelectedPortfolio ] = React.useState<Portfolio>();
  const [ historicalData, setHistoricalData ] = React.useState<PortfolioHistoryValue[]>([]);

  /**
   * Loads own funds
   */
  const loadOwnFunds = async () => {
    if (!auth) {
      return;
    }

    try {
      const allPortfolios: Portfolio[] = [];
      AuthUtils.isDemoUser(auth) ?
        allPortfolios.push(...TestData.getTestPortfolio(1)) :
        allPortfolios.push(...await Api.getPortfoliosApi(auth).listPortfolios());

      if (allPortfolios.length !== 1) {
        return;
      }

      setSelectedPortfolio(allPortfolios[0]);
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list);
    }
  };

  /**
   * Loads fund history
   *
   * @param range chart range
   */
  const loadHistoryData = async (range: ChartRange) => {
    if (!auth || !selectedPortfolio?.id) {
      return;
    }

    setLoading(true);

    const demoUser = AuthUtils.isDemoUser(auth);

    try {
      setHistoricalData(
        demoUser ?
          TestData.getTestHistoricalValues(range) :
          await Api.getPortfoliosApi(auth).listPortfolioHistoryValues({
            portfolioId: selectedPortfolio.id,
            startDate: ChartUtils.getStartDate(range),
            endDate: moment().toDate()
          })
      );
    } catch (error) {
      errorContext.setError(strings.errorHandling.fundHistory.list, error);
    }

    setLoading(false);
  };

  /**
   * Effect for loading own funds when navigation changes
   */
  React.useEffect(() => {
    navigation.addListener("focus", loadOwnFunds);
    return () => navigation.removeListener("focus", loadOwnFunds);
  }, [ navigation ]);

  /**
   * Renders total
   */
  const renderTotal = () => {
    if (!selectedPortfolio) {
      return null;
    }

    const { marketValueTotal, purchaseTotal } = selectedPortfolio;
    const totalChangeAmount = Calculations.getTotalChangeAmount(purchaseTotal, marketValueTotal);
    const totalChangePercentage = Calculations.getTotalChangePercentage(purchaseTotal, marketValueTotal);

    return (
      <View style={ styles.totalContent }>
        <View style={ styles.totalTextContainer }>
          <Icon name="briefcase-outline" size={ 26 } color="white"/>
          <Text style={ styles.totalText }>
            { `${marketValueTotal || 0} €` }
          </Text>
        </View>
        <View style={ styles.totalPurchaseContainer }>
          <View style={{ alignItems: "center" }}>
            <Text style={ styles.purchaseText }>
              { strings.portfolio.statistics.purchaseTotal }
            </Text>
            <Text style={ styles.purchaseText }>
              { `${purchaseTotal} €` }
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={ styles.purchaseText }>
              { strings.portfolio.statistics.change }
            </Text>
            <Text style={ styles.purchaseText }>
              { `${totalChangeAmount}€ | ${totalChangePercentage}%` }
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renders chart
   */
  const renderChart = () => {
    if (!selectedPortfolio) {
      return null;
    }

    return (
      <View style={{ width: "100%" }}>
        <FundChart
          data={ historicalData }
          loading={ loading }
          onRangeChange={ loadHistoryData }
        />
      </View>
    );
  };

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
   */
  const renderInfo = () => {
    if (!selectedPortfolio) {
      return null;
    }

    const currentValue = historicalData[historicalData.length - 1].value;
    const purchaseValue = historicalData[0].value;
    const totalChangeAmount = Calculations.getTotalChangeAmount(purchaseValue, currentValue);
    const totalChangePercentage = Calculations.getTotalChangePercentage(purchaseValue, currentValue);

    return (
      <View style={ styles.infoContainer }>
        { renderInfoRow(strings.portfolio.statistics.totalChange, `${totalChangeAmount} € | ${totalChangePercentage}%`) }
        { renderInfoRow(strings.portfolio.statistics.markings, "---") }
        { renderInfoRow(strings.portfolio.statistics.redemptions, "---") }
        { renderInfoRow(strings.portfolio.statistics.total, currentValue?.toString() || "0") }
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.viewContainer }>
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
    </ScrollView>
  );
};

export default StatisticsScreen;