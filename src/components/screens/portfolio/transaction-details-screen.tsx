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
import BigNumber from "bignumber.js";
import Calculations from "../../../utils/calculations";
import moment from "moment";

/**
 * Type for detail row
 */
type DetailRow = {
  label: string;
  value?: string;
};

/**
 * Transaction details screen component
 */
const TransactionDetailsScreen: React.FC = () => {
  const navigation = useNavigation<TransactionsNavigator.NavigationProps<"transactionsDetails">>();
  const { params } = useRoute<TransactionsNavigator.RouteProps>();
  const localized = strings.portfolio.transactions;

  if (!params) {
    return null;
  }

  const { fund, security, portfolioTransaction } = params;
  const { color } = fund;
  const { name } = security;
  const { transactionType, valueDate, paymentDate, provision, shareAmount, marketValue } = portfolioTransaction;

  /**
   *
   * Render details row
   *
   * @param detailRow detail row
   */
  const renderDetailsRow = ({ label, value }: DetailRow) => {
    return (
      <View key={ label } style={ styles.detailsRow }>
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
    const transactionDisplayType = localized[transactionType === TransactionType.Redemption ? "redemption" : "subscription"];
    const totalValue = new BigNumber(marketValue).multipliedBy(shareAmount);
    const paidTotal = new BigNumber(totalValue).plus(provision);

    const rows: DetailRow[] = [
      {
        label: localized.type,
        value: transactionDisplayType
      },
      {
        label: localized.valueDate,
        value: moment(valueDate).format("DD.MM.YYYY")
      },
      {
        label: localized.paymentDate,
        value: paymentDate ? moment(paymentDate).format("DD.MM.YYYY") : undefined
      },
      {
        label: localized.shareAmount,
        value: Calculations.formatNumberStr(shareAmount, 4, { suffix: " kpl" })
      },
      {
        label: localized.value,
        value: Calculations.formatNumberStr(marketValue, 4, { suffix: " €" })
      },
      {
        label: localized.totalValue,
        value: Calculations.formatNumberStr(totalValue, 2, { suffix: " €" })
      },
      {
        label: localized.provision,
        value: Calculations.formatNumberStr(provision, 2, { suffix: " €" })
      },
      {
        label: localized.paidTotal,
        value: Calculations.formatNumberStr(paidTotal, 2, { suffix: " €" })
      }
    ];

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
            style={[ styles.gradient, { backgroundColor: color } ]}
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

export default TransactionDetailsScreen;