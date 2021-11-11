
import React from "react";
import { ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import FundChart from "../../generic/fund-chart";
import FundDetails from "../../generic/fund-details";
import { useNavigation, useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import { Button, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/funds/funds-details-screen";

/**
 * Funds details screen
 */
const FundsDetailsScreen: React.FC = () => {
  const { params } = useRoute<FundsNavigator.RouteProps>();
  const navigation = useNavigation<FundsNavigator.NavigationProps>();

  if (!params?.fund) return null;

  /**
   * Component render
   */
  return (
    <>
      <Button
        icon="arrow-left-circle"
        onPress={ () => navigation.goBack() }
        labelStyle={{ color: "#fff" }}
        style={ styles.backButton }
      >
        <Text style={{ color: "#fff" }}>
          { strings.generic.back }
        </Text>
      </Button>
      <ScrollView>
        <FundChart fund={ params.fund }/>
        <View style={ styles.detailsWrapper }>
          <FundCard fund={ params.fund }/>
          <FundDetails fund={ params.fund }/>
        </View>
      </ScrollView>
    </>
  );
};

export default FundsDetailsScreen;