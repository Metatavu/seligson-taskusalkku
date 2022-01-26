import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import FundDetails from "../../generic/fund-details";
import { useNavigation, useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import { Button, Paragraph } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/funds/funds-details-screen";
import { ChartRange } from "../../../types";
import { ErrorContext } from "../../error-handler/error-handler";
import theme from "../../../theme";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import ChartUtils from "../../../utils/chart";
import HistoryValueChart from "../../generic/history-value-chart";
import { SecurityHistoryValue } from "../../../generated/client";
import ChartRangeSelector from "../../generic/chart-range-selector";

/**
 * Fund details screen component
 */
const FundDetailsScreen: React.FC = () => {
  const { params } = useRoute<FundsNavigator.RouteProps<"fundDetails">>();
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);
  const securitiesContext = React.useContext(SecuritiesApiContext);
  const fund = params?.fund;

  const [ loading, setLoading ] = React.useState(true);
  const [ historyValues, setHistoryValues ] = React.useState<SecurityHistoryValue[]>([]);
  const [ selectedRange, setSelectedRange ] = React.useState<Date[] | ChartRange>(ChartRange.MONTH);

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
      const securities = await securitiesContext.listSecurities({ maxResults: 20000 });
      const fundSecurities = securities.filter(security => security.fundId === fund.id);
      const aSecurity = fundSecurities.length === 1 ? fundSecurities[0] : fundSecurities.find(security => security.name.fi.includes("(A)"));

      if (!aSecurity?.id) {
        throw new Error("Could not find A security!");
      }

      const { startDate, endDate } = ChartUtils.getDateFilters(selectedRange);

      setHistoryValues(
        await securitiesContext.listSecurityHistoryValues({
          securityId: aSecurity.id,
          maxResults: 10000,
          startDate: startDate,
          endDate: endDate
        })
      );
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
          <ChartRangeSelector
            selectedRange={ selectedRange }
            onDateRangeChange={ setSelectedRange }
          />
          <HistoryValueChart historyValues={ historyValues }/>
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
        <Paragraph style={{ color: "#fff" }}>
          { strings.generic.back }
        </Paragraph>
      </Button>
      <ScrollView>
        { renderContent() }
      </ScrollView>
    </>
  );
};

export default FundDetailsScreen;