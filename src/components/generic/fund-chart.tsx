import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Fund } from "../../generated/client/models/Fund";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
}

/**
 * Fnd chart
 *
 * @param props component properties
 */
const FundChart: React.FC<Props> = ({ fund }) => {
  const { color } = fund;
    
  /**
   * Component render
   */
  return (
    <>
      <View>
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