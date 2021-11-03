import React from "react";
import { ScrollView, View } from "react-native";
import { FundType } from "../../../types";
import FundCard from "../../generic/fund-card";
import fakeFunds from "../../../resources/fake-funds";

/**
 * Active funds screen
 */
const ActiveFundsScreen: React.FC = () => {
  const filteredFunds = fakeFunds
    .filter(({ fundType }) => fundType === FundType.ACTIVE)
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
          alignItems: "center"
        }}
      >
        { filteredFunds.map(fund => <FundCard fund={ fund }/>) }
      </View>
    </ScrollView>
  );
};

export default ActiveFundsScreen;