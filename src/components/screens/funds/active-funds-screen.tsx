import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import strings from "../../../localization/strings";
import FundCard from "../../generic/fund-card";

/**
 * Active funds screen
 */
const ActiveFundsScreen: React.FC = () => {
  /**
   * Component render
   */
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center"
      }}
    >
      <FundCard fundId={ 0 }/>
      <FundCard fundId={ 1 }/>
    </View>
  );
};

export default ActiveFundsScreen;