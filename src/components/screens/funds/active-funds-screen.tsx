import React from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import FundCard from "../../generic/fund-card";
import { Fund } from "../../../generated/client/models/Fund";
import { useNavigation } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import styles from "../../../styles/screens/funds/active-funds";
import FundUtils from "../../../utils/funds";
import { useHardwareGoBack } from "../../../app/hooks";

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
  useHardwareGoBack();
  const navigation = useNavigation<FundsNavigator.NavigationProps>();

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
        { FundUtils.sortFunds(funds).map(renderFund) }
      </View>
    </ScrollView>
  );
};

export default ActiveFundsScreen;