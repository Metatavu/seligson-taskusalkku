import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import strings from "../../../localization/strings";

/**
 * Distributions screen component
 */
const DistributionsScreen: React.FC = () => {
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

export default DistributionsScreen;