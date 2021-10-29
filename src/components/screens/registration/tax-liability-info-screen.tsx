import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import strings from "../../../localization/strings";

/**
 * Tax liability screen
 */
const TaxLiabilityScreen: React.FC = () => {
  /**
   * Component render
   */
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text>{ strings.generic.notImplemented }</Text>
    </View>
  );
};

export default TaxLiabilityScreen;