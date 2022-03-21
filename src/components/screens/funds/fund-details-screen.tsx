import React from "react";
import { ActivityIndicator, GestureResponderEvent, Platform, ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import FundDetails from "../../generic/fund-details";
import { CompositeNavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/funds/funds-details-screen";
import { ChartRange, Currency } from "../../../types";
import { ErrorContext } from "../../error-handler/error-handler";
import theme from "../../../theme";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import ChartUtils from "../../../utils/chart";
import HistoryValueChart from "../../generic/history-value-chart";
import { SecurityHistoryValue } from "../../../generated/client";
import ChartRangeSelector from "../../generic/chart-range-selector";
import HomeNavigator from "../../../types/navigators/home";
import BackButton from "../../generic/back-button";
import DateUtils from "../../../utils/date-utils";
import { useHardwareGoBack } from "../../../app/hooks";
import FundUtils from "../../../utils/funds";

type FundDetailScreenNavigationProp = CompositeNavigationProp<FundsNavigator.NavigationProps, HomeNavigator.NavigationProps>;

/**
 * Fund details screen component
 */
const FundDetailsScreen: React.FC = () => {
  useHardwareGoBack();
  const { params } = useRoute<FundsNavigator.RouteProps<"fundDetails">>();
  const navigation = useNavigation<FundDetailScreenNavigationProp>();
  const errorContext = React.useContext(ErrorContext);
  const securitiesContext = React.useContext(SecuritiesApiContext);
  const fund = params?.fund;

  const [ loading, setLoading ] = React.useState(true);
  const [ historyValues, setHistoryValues ] = React.useState<SecurityHistoryValue[]>([]);
  const [ currency, setCurrency ] = React.useState<Currency>();
  const [ selectedRange, setSelectedRange ] = React.useState<Date[] | ChartRange>(ChartRange.MAX);
  const [ scrollEnabled, setScrollEnabled ] = React.useState(true);

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
      const mainSecurity = await FundUtils.resolveMainSecurity(securitiesContext, fund.id);

      if (!mainSecurity?.id) {
        throw new Error("Could not find main security!");
      }

      const { startDate, endDate } = DateUtils.getDateFilters(selectedRange);

      setCurrency(mainSecurity.currency as Currency);

      setHistoryValues(
        await securitiesContext.listSecurityHistoryValues({
          securityId: mainSecurity.id,
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
   * Toggles scrolling
   *
   * @param enabled enabled
   */
  const toggleScroll = (enabled: boolean) => (event: GestureResponderEvent) => {
    setScrollEnabled(enabled);
    event.preventDefault();
  };

  /**
   * Effect for loading history data when selected fund changes
   */
  React.useEffect(() => { loadHistoryData(); }, [ fund, selectedRange ]);

  /**
   * Renders history value chart
   */
  const renderChart = () => {
    if (loading) {
      return (
        <View style={ styles.loaderContainer }>
          <ActivityIndicator size="large" color={ theme.colors.primary }/>
        </View>
      );
    }

    return (
      <HistoryValueChart
        historyValues={ historyValues }
        color={ ChartUtils.RGBToHex(fund.color || "rgb(0,0,0)") }
        currency={ currency }
        onChartTouch={ toggleScroll(false) }
      />
    );
  };

  /**
   * Renders content
   */
  const renderContent = () => (
    <>
      <View style={[ styles.chart, !scrollEnabled && styles.focused ]}>
        <ChartRangeSelector
          selectedRange={ selectedRange }
          loading={ loading }
          onDateRangeChange={ setSelectedRange }
        />
        { renderChart() }
      </View>
      <View
        style={ styles.detailsWrapper }
        onTouchStart={ toggleScroll(true) }
      >
        <View style={ styles.cardWrapper }>
          <FundCard fund={ fund }/>
        </View>
        <FundDetails
          fund={ fund }
          currency={ currency }
          onSubscribePress={ () => navigation.navigate("fundSubscriptionSettings", { fund: fund }) }
        />
      </View>
    </>
  );

  /**
   * Component render
   */
  return (
    <>
      { Platform.OS === "ios" && <BackButton/> }
      <ScrollView
        scrollEventThrottle={ 16 }
        scrollEnabled={ scrollEnabled }
        overScrollMode="never"
      >
        { renderContent() }
      </ScrollView>
    </>
  );
};

export default FundDetailsScreen;