import React from "react";
import { ScrollView, View } from "react-native";
import fakeFunds from "../../../resources/fake-funds";
import FundCard from "../../generic/fund-card";
import FundChart from "../../generic/fund-chart";
import FundDetails from "../../generic/fund-details";

/**
 * Active funds screen
 */
const FundDetailsScreen: React.FC = () => {
  const filteredFunds = fakeFunds
    .filter(({ id }) => id === 123456788);
  /**
   * Component render
   */
  return (
    <ScrollView>
      { filteredFunds.map(fund => <FundChart fund={ fund }/>) }
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 10
        }}
      >
        { filteredFunds.map(fund => <FundCard fund={ fund }/>) }
        { filteredFunds.map(fund => <FundDetails fund={ fund }/>) }
      </View>
    </ScrollView>
  );
};

export default FundDetailsScreen;