import React from "react";
import { ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import fakeFunds from "../../../resources/fake-funds";
import { Fund } from "../../../generated/client/models/Fund";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import { FundGroup } from "../../../generated/client";
import styles from "../../../styles/screens/funds/passive-funds";

/**
 * Passive funds screen
 */
const PassiveFundsScreen: React.FC = () => {
  const navigation = useNavigation<FundsNavigator.NavigationProps>();

  const filteredFunds = fakeFunds
    .filter(({ group }) => group === FundGroup.Passive)
    .sort((a, b) => a.name.fi.localeCompare(b.name.fi));

  /**
   * Render fund
   */
  const renderFund = (fund: Fund) => (
    <TouchableOpacity onPress={ () => navigation.navigate("fundsDetails", { fund: fund })}>
      <FundCard fund={ fund }/>
    </TouchableOpacity>
  );

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.fundList }>
        { filteredFunds.map(renderFund) }
      </View>
    </ScrollView>
  );
};

export default PassiveFundsScreen;