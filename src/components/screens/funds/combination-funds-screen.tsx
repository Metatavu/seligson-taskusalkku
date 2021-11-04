import React from "react";
import { ScrollView, View } from "react-native";
import { FundType } from "../../../types";
import FundCard from "../../generic/fund-card";
import fakeFunds from "../../../resources/fake-funds";

/**
 * Combination funds screen
 */
const CombinationFundsScreen: React.FC = () => {
  const filteredFunds = fakeFunds
    .filter(({ fundType }) => fundType === FundType.COMPINATION)
    .sort((a, b) => a.fundName.localeCompare(b.fundName));
  /**
   * Component render
   */
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 10
        }}
      >
        { filteredFunds.map(fund => <FundCard fund={ fund }/>) }
      </View>
    </ScrollView>
  );
};

export default CombinationFundsScreen;