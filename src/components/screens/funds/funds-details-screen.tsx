import React from "react";
import { ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import DataChart from "../../generic/data-chart";
import FundDetails from "../../generic/fund-details";
import { useNavigation, useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import { Button, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/funds/funds-details-screen";
import { HistoricalValue } from "../../../generated/client";
import { ChartRange } from "../../../types";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/auth-slice";
import AuthUtils from "../../../utils/auth";
import TestData from "../../../resources/test-data";
import moment from "moment";
import Api from "../../../api/api";
import ChartUtils from "../../../utils/chart";
import { ErrorContext } from "../../error-handler/error-handler";

/**
 * Funds details screen
 */
const FundsDetailsScreen: React.FC = () => {
  const { params } = useRoute<FundsNavigator.RouteProps>();
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const auth = useAppSelector(selectAuth);
  const errorContext = React.useContext(ErrorContext);
  const fund = params?.fund;

  const [ loading, setLoading ] = React.useState(true);
  const [ historicalData, setHistoricalData ] = React.useState<HistoricalValue[]>([]);

  if (!fund) {
    return null;
  }

  /**
   * Loads fund history
   *
   * @param range selected chart range or month as default
   */
  const loadHistoryData = async (range: ChartRange = ChartRange.MONTH) => {
    if (!auth || !fund.id) {
      return;
    }

    setLoading(true);

    const demoUser = AuthUtils.isDemoUser(auth);

    try {
      setHistoricalData(
        demoUser ?
          TestData.getTestHistoricalValues(365) :
          await Api.getPortfoliosApi(auth).listPortfolioHistoryValues({
            portfolioId: fund.id,
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
   * Effect for loading history data when selected fund changes
   */
  React.useEffect(() => { loadHistoryData(); }, [ fund ]);

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
        <DataChart
          data={ historicalData }
          loading={ loading }
          color={ fund.color }
          onRangeChange={ loadHistoryData }
        />
        <View style={ styles.detailsWrapper }>
          <FundCard fund={ fund }/>
          <FundDetails fund={ fund }/>
        </View>
      </ScrollView>
    </>
  );
};

export default FundsDetailsScreen;