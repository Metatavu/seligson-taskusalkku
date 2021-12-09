import React from "react";
import { View } from "react-native";
import theme from "../../../theme";
import { Button, Divider, Text } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import TransactionsNavigator from "../../../types/navigators/transactions";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/portfolio/transactions-details-screen";
import GenericUtils from "../../../utils/generic";
import { LinearGradient } from "expo-linear-gradient";
import { TransactionType } from "../../../generated/client";

/**
 * Transactions details screen component
 */
const TransactionsDetailsScreen: React.FC = () => {
  const navigation = useNavigation<TransactionsNavigator.NavigationProps>();
  const { params } = useRoute<TransactionsNavigator.RouteProps>();
  const { fund, portfolioTransaction } = params || {}:
  const { type, valueDate, paymentDate, shareAmount, marketValue, provision } = portfolioTransaction;
  const transctionType = type === TransactionType.Redemption ?
    strings.portfolio.transactions.redemption :
    strings.portfolio.transactions.subscription;
  const { longName, color } = fund;

  /**
   * Render details row
   *
   * @param label label
   * @param detailValue detail value
   */
  const renderDetailsRow = (label: string, detailValue: string | number) => {
    return (
      <View style={ styles.detailsRow }>
        <Text style={ theme.fonts.medium }>
          { label }
        </Text>
        <Text>
          { detailValue }
        </Text>
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <View style={ styles.detailsScreen }>
      <View style={ styles.cardWrapper }>
        <View style={ styles.gradientContainer }>
          <LinearGradient
            colors={[ "transparent", "rgba(0,0,0,0.5)" ]}
            style={[ styles.gradient, { backgroundColor: color } ]}
          />
        </View>
        <View style={ styles.detailsWrapper }>
          <Text style={[ theme.fonts.medium, styles.transactionTitle ]}>
            { longName && GenericUtils.getLocalizedValue(longName) }
          </Text>
          <Divider style={{ marginVertical: 5 }}/>
          { renderDetailsRow(strings.portfolio.transactions.type, transctionType) }
          { renderDetailsRow(strings.portfolio.transactions.valueDate, valueDate.toLocaleDateString()) }
          { renderDetailsRow(strings.portfolio.transactions.paymentDate, paymentDate.toLocaleDateString()) }
          { renderDetailsRow(strings.portfolio.transactions.shareAmount, shareAmount) }
          { renderDetailsRow(strings.portfolio.transactions.value, marketValue) }
          { renderDetailsRow(strings.portfolio.transactions.totalValue, shareAmount * marketValue) }
          { renderDetailsRow(strings.portfolio.transactions.provision, provision) }
          { renderDetailsRow(strings.portfolio.transactions.paidTotal, (shareAmount * marketValue) + provision) }
        </View>
      </View>
      <Button
        icon="arrow-left-circle"
        onPress={ navigation.goBack }
        labelStyle={{ color: "#fff" }}
        style={ styles.backButton }
      >
        <Text style={{ color: "#fff" }}>
          { strings.generic.back }
        </Text>
      </Button>
    </View>
  );
};

export default TransactionsDetailsScreen;