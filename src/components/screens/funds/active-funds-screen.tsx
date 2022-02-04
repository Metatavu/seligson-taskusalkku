import React from "react";
import { ScrollView, View } from "react-native";
import FundCard from "../../generic/fund-card";
import { Fund } from "../../../generated/client/models/Fund";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import styles from "../../../styles/screens/funds/active-funds";

/**
 * Component properties
 */
interface Props {
  funds: Fund[];
}

/**
 * Active funds screen component
 *
 * @param props component properties
 */
const ActiveFundsScreen: React.FC<Props> = ({ funds }) => {
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const sortedFunds = funds.sort((a, b) => a.name.fi.localeCompare(b.name.fi));

  /**
   * Renders fund
   *
   * @param fund fund
   */
  const renderFund = (fund: Fund) => (
    <TouchableOpacity
      onPress={ () => navigation.navigate("fundDetails", { fund: fund }) }
      key={ `activeFundsTouchable${fund.id}` }
      style={ styles.funCard }
    >
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

export default ActiveFundsScreen;