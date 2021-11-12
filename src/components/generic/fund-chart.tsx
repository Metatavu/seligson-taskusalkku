import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Button, Text } from "react-native-paper";
import { Fund } from "../../generated/client/models/Fund";
import styles from "../../styles/generic/fund-chart";
import strings from "../../localization/strings";

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
            labels: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä"],
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
          yAxisInterval={1} // optional, defaults to 1
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
              strokeWidth: "2",
              stroke: color
            }
          }}
          bezier
          style={{
            marginVertical: 0
          }}
        />
      </View>
    </>
  );
};

export default FundChart;