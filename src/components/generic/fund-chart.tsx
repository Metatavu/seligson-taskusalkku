import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Button, Text } from "react-native-paper";
import { Fund } from "../../generated/client/models/Fund";
import styles from "../../styles/generic/fund-chart";
import strings from "../../localization/strings";
import { ErrorContext } from "../error-handler/error-handler";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
}

/**
 * Fund chart
 *
 * @param props component properties
 */
const FundChart: React.FC<Props> = ({ fund }) => {
  const { color } = fund;
  const errorContext = React.useContext(ErrorContext);
  const auth = useAppSelector(selectAuth);
  const [ historicalValues, setHistoricalValues ] = React.useState<HistoricalValue[]>([]);

  /**
   * Loads fund history
   */
  const loadFundHistory = async () => {
    if (!auth || !fund.id) {
      return;
    }

    console.log("fund", fund);

    try {
      const historyData = await Api.getFundsApi(auth).listHistoricalValues({ fundId: fund.id });
      setHistoricalValues(historyData);
    } catch (error) {
      errorContext.setError("Error while loading fund history", error);
    }
  };

  React.useEffect(() => { loadFundHistory(); }, []);

  /**
   * Date range button
   *
   * @param range range
   * @param icon icon
   */
  const renderDateRangeButton = (range: string, icon?: string) => {
    return (
      <Button
        icon={ icon }
        uppercase={ false }
        compact
        style={ styles.dateRangeButton }
      >
        <Text style={ styles.dateRangeButtonText }>
          { range }
        </Text>
      </Button>
    );
  };

  /**
   * Component render
   */
  return (
    <>
      <View>
        <View style={ styles.dateRangeButtonRow }>
          { renderDateRangeButton(strings.fundCard.historyOneDay) }
          { renderDateRangeButton(strings.fundCard.historyOneMonth) }
          { renderDateRangeButton(strings.fundCard.historyOneYear) }
          { renderDateRangeButton(strings.fundCard.historyFiveYears) }
          { renderDateRangeButton(strings.fundCard.historyTwentyYears) }
          { renderDateRangeButton("Max") }
          <Button icon="calendar" color="#fff"/>
        </View>
        <LineChart
          data={{
            labels: [ "Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä" ],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
                ]
              }
            ]
          }}
          width={ Dimensions.get("window").width } // from react-native
          height={ 300 }
          yAxisLabel=""
          yAxisSuffix="€"
          yAxisInterval={ 1 } // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#3E3F44",
            backgroundGradientFrom: "#3E3F44",
            backgroundGradientTo: "#3E3F44",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: () => `${color}`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 0
            },
            propsForDots: {
              r: "6",
              strokeWidth: "1",
              stroke: color
            }
          }}
          style={{
            marginVertical: 0
          }}
        />
      </View>
    </>
  );
};

export default FundChart;