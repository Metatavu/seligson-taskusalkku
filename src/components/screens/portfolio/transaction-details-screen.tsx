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
import BackButton from "../../generic/back-button";

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
  const { transactionType, valueDate, paymentDate, provision, shareAmount, marketValue, totalValue } = portfolioTransaction;

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
        value: Calculations.formatEuroNumberStr(marketValue, 4)
      },
      {
        label: localized.totalValue,
        value: Calculations.formatEuroNumberStr(totalValue)
      },
      {
        label: localized.provision,
        value: Calculations.formatEuroNumberStr(provision)
      },
      {
        label: localized.paidTotal,
        value: Calculations.formatEuroNumberStr(paidTotal)
      }
    ];

    return rows.map(renderDetailsRow);
  };

  /**
   * Component render
   */
  return (
    <View style={ styles.detailsScreen }>
      <BackButton/>
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
    </View>
  );
};

export default TransactionDetailsScreen;