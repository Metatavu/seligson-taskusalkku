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
 * Type for detail row
 */
type DetailRow = {
  label: string;
  value?: string | number;
};

/**
 * Transactions details screen component
 */
const TransactionsDetailsScreen: React.FC = () => {
  const navigation = useNavigation<TransactionsNavigator.NavigationProps<"transactionsDetails">>();
  const { params } = useRoute<TransactionsNavigator.RouteProps>();
  const localized = strings.portfolio.transactions;

  if (!params) {
    return null;
  }

  const { security, portfolioTransaction } = params;
  const { name } = security;
  const { transactionType, valueDate, paymentDate, provision } = portfolioTransaction;
  const shareAmount = Number(portfolioTransaction.shareAmount);
  const marketValue = Number(portfolioTransaction.marketValue);

  /**
   *
   * Render details row
   *
   * @param detailRow detail row
   */
  const renderDetailsRow = ({ label, value }: DetailRow) => {
    return (
      <View style={ styles.detailsRow }>
        <Text style={ theme.fonts.medium }>
          { label }
        </Text>
        <Text>
          { value }
        </Text>
      </View>
    );
  };

  /**
   * Renders detail rows
   */
  const renderDetailRows = () => {
    const rows = [{
      label: localized.type,
      value: localized[transactionType === TransactionType.Redemption ? "redemption" : "subscription"]
    }, {
      label: localized.valueDate,
      value: valueDate.toLocaleDateString()
    }, {
      label: localized.paymentDate,
      value: paymentDate?.toLocaleDateString()
    }, {
      label: localized.shareAmount,
      value: shareAmount
    }, {
      label: localized.value,
      value: marketValue
    }, {
      label: localized.totalValue,
      value: Number(shareAmount) * Number(marketValue)
    }, {
      label: localized.provision,
      value: provision
    }, {
      label: localized.paidTotal,
      value: (shareAmount * marketValue) + provision
    }];

    return rows.map(renderDetailsRow);
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
            style={[ styles.gradient, { backgroundColor: "#fff" } ]}
          />
        </View>
        <View style={ styles.detailsWrapper }>
          <Text style={[ theme.fonts.medium, styles.transactionTitle ]}>
            { GenericUtils.getLocalizedValue(name) }
          </Text>
          <Divider style={{ marginVertical: 5 }}/>
          { renderDetailRows() }
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