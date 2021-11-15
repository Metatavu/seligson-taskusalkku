import React from "react";
import { ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import { Fund } from "../../../generated/client/models/Fund";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import styles from "../../../styles/screens/funds/interest-funds";

interface Props {
  funds: Fund[];
}

/**
 * Interest funds screen
 */
const InterestFundsScreen: React.FC<Props> = ({ funds }) => {
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const sortedFunds = funds.sort((a, b) => a.name.fi.localeCompare(b.name.fi));

  /**
   * Render fund
   *
   * @param fund fund
   */
  const renderFund = (fund: Fund) => (
    <TouchableOpacity onPress={ () => navigation.navigate("fundsDetails", { fund: fund }) }>
      <FundCard fund={ fund }/>
    </TouchableOpacity>
  );

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.fundList }>
        { sortedFunds.map(renderFund) }
      </View>
    </ScrollView>
  );
};

export default InterestFundsScreen;