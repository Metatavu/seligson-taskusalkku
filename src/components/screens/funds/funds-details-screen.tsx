import React from "react";
import { ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import FundChart from "../../generic/fund-chart";
import FundDetails from "../../generic/fund-details";
import styles from "../../../styles/screens/funds/fund-screen";
import { useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";

/**
 * Funds details screen
 */
const FundsDetailsScreen: React.FC = () => {
  const { params } = useRoute<FundsNavigator.RouteProps>();

  if (!params?.fund) return null;

  /**
   * Component render
   */
  return (
    <ScrollView>
      <FundChart fund={ params.fund }/>
      <View style={ styles.detailsWrapper }>
        <FundCard fund={ params.fund }/>
        <FundDetails fund={ params.fund }/>
      </View>
    </ScrollView>
  );
};

export default FundsDetailsScreen;