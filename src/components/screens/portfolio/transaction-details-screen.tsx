import React from "react";
import { View, Text, Platform } from "react-native";
import theme from "../../../theme";
import { Divider } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/portfolio/transactions-details-screen";
import GenericUtils from "../../../utils/generic";
import { TransactionType } from "../../../generated/client";
import BigNumber from "bignumber.js";
import Calculations from "../../../utils/calculations";
import BackButton from "../../generic/back-button";
import DateUtils from "../../../utils/date-utils";
import PortfolioNavigator from "../../../types/navigators/portfolio";
import { useHardwareGoBack } from "../../../app/hooks";

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
  useHardwareGoBack();
  const { params } = useRoute<PortfolioNavigator.RouteProps<"transactionsDetails">>();
  const localized = strings.portfolio.transactions;

  if (!params) {
    return null;
  }

  const { fund, security, portfolioTransaction } = params;
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
        value: DateUtils.formatToFinnishDate(valueDate)
      },
      {
        label: localized.paymentDate,
        value: paymentDate ? DateUtils.formatToFinnishDate(paymentDate) : undefined
      },
      {
        label: strings.fundDetailsScreen.amount,
        value: Calculations.formatNumberStr(shareAmount, 4, { suffix: ` ${strings.portfolio.transactions.shareAmount}` })
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
      { Platform.OS === "ios" && <BackButton/> }
      <View style={ styles.cardWrapper }>
        <View style={[ styles.gradientContainer, { backgroundColor: fund.color } ]}/>
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