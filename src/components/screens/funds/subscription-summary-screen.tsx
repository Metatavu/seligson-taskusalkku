import React from "react";
import { ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import { Fund } from "../../../generated/client/models/Fund";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import styles from "../../../styles/screens/funds/passive-funds";

/**
 * Component properties
 */
interface Props {
  funds: Fund[];
}

/**
 * Passive funds screen component
 *
 * @param props component properties
 */
const SubscriptionSummaryScreen: React.FC<Props> = ({ funds }) => {
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const sortedFunds = funds.sort((a, b) => a.name.fi.localeCompare(b.name.fi));

  /**
   * Render fund
   *
   * @param fund fund
   */
  const renderFund = (fund: Fund) => (
    <TouchableOpacity
      onPress={ () => navigation.navigate("fundDetails", { fund: fund }) }
      key={ `passiveFundsTouchable${fund.id}` }
    >
      <FundCard fund={ fund } key={`fund${fund.id}`}/>
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

export default SubscriptionSummaryScreen;