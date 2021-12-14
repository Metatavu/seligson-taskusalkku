import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import DataChart from "../../generic/data-chart";
import FundDetails from "../../generic/fund-details";
import { useNavigation, useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import { Button, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/funds/funds-details-screen";
import { FundHistoryValue } from "../../../generated/client";
import { ChartRange } from "../../../types";
import { ErrorContext } from "../../error-handler/error-handler";
import theme from "../../../theme";
import { FundsApiContext } from "../../providers/funds-api-provider";
import ChartUtils from "../../../utils/chart";
import moment from "moment";

/**
 * Fund details screen
 */
const FundDetailsScreen: React.FC = () => {
  const { params } = useRoute<FundsNavigator.RouteProps<"fundsDetails">>();
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);
  const fundsApiContext = React.useContext(FundsApiContext);
  const fund = params?.fund;

  const [ loading, setLoading ] = React.useState(true);
  const [ selectedRange, setSelectedRange ] = React.useState(ChartRange.MONTH);
  const [ historicalData, setHistoricalData ] = React.useState<FundHistoryValue[]>([]);

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
      setHistoricalData(await fundsApiContext.listFundHistoryValues({
        fundId: fund.id,
        startDate: ChartUtils.getStartDate(selectedRange),
        endDate: moment().toDate()
      }));
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
        <DataChart
          data={ historicalData }
          loading={ loading }
          color={ fund.color }
          selectedRange={ selectedRange }
          onRangeChange={ setSelectedRange }
        />
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
        <Text style={{ color: "#fff" }}>
          { strings.generic.back }
        </Text>
      </Button>
      <ScrollView>
        { renderContent() }
      </ScrollView>
    </>
  );
};

export default FundDetailsScreen;