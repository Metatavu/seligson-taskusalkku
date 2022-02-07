import React from "react";
import { View, Text } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import theme from "../../theme";
import transactionsCardStyles from "../../styles/generic/transactions-card";
import strings from "../../localization/strings";
import { Fund, PortfolioTransaction, Security } from "../../generated/client";
import { TouchableOpacity } from "react-native-gesture-handler";
import GenericUtils from "../../utils/generic";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import TransactionsNavigator from "../../types/navigators/transactions";
import Calculations from "../../utils/calculations";

/**
 * Transaction value
 */
interface TransactionValue {
  label: string;
  value: string;
}

/**
 * Component properties
 */
interface Props {
  title: string;
  funds: Fund[];
  securities: Security[];
  transactions: PortfolioTransaction[];
}

/**
 * Transactions card component
 *
 * @param props component properties
 */
const TransactionsCard: React.FC<Props> = ({ title, funds, securities, transactions }) => {
  const styles = transactionsCardStyles(useTheme(), "#fff");
  const navigation = useNavigation<TransactionsNavigator.NavigationProps>();

  const [ closed, setClosed ] = React.useState(true);

  /**
   * Renders transaction value
   *
   * @param label label
   * @param value value
   */
  const renderTransactionValue = ({ label, value }: TransactionValue) => (
    <View key={ label } style={ styles.shareColumn }>
      <Text style={ styles.labelText }>
        { label }
      </Text>
      <Text>
        { value }
      </Text>
    </View>
  );

  /**
   * Renders single transaction
   *
   * @param transaction transaction
   */
  const renderTransaction = (transaction: PortfolioTransaction) => {
    const { securityId, id, paymentDate, marketValue, shareAmount, totalValue } = transaction;

    const transactionSecurity = securities.find(security => security.id === securityId);
    if (!transactionSecurity) {
      return null;
    }

    const transactionFund = funds.find(fund => fund.id === transactionSecurity.fundId);
    if (!transactionFund) {
      return null;
    }

    const transactionValues: TransactionValue[] = [
      {
        label: strings.portfolio.transactions.value,
        value: Calculations.formatNumberStr(marketValue, 4, { suffix: " €" })
      },
      {
        label: strings.fundDetailsScreen.amount,
        value: Calculations.formatNumberStr(shareAmount, 4, { suffix: ` ${strings.portfolio.transactions.shareAmount}` })
      },
      {
        label: strings.portfolio.statistics.total,
        value: Calculations.formatNumberStr(totalValue, 2, { suffix: " €" })
      }
    ];

    return (
      <TouchableOpacity
        key={ id }
        onPress={ () =>
          navigation.navigate("transactionsDetails", {
            fund: transactionFund,
            security: transactionSecurity,
            portfolioTransaction: transaction
          })
        }
      >
        <View style={ styles.transactionWrapper }>
          <View style={[ styles.colorBar, { backgroundColor: transactionFund.color } ]}/>
          <View style={ styles.transactionContent }>
            <View style={ styles.transactionTitle }>
              <Text style={[ theme.fonts.medium, { flex: 1 } ]}>
                { transactionFund.longName &&
                  GenericUtils.getLocalizedValue(transactionFund.longName)
                }
              </Text>
              <Text style={ styles.labelText }>
                { paymentDate?.toLocaleDateString() }
              </Text>
            </View>
            <Divider style={{ marginVertical: 5 }}/>
            <View style={ styles.cardRow }>
              { transactionValues.map(renderTransactionValue) }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Renders transactions
   */
  const renderTransactions = () => (
    transactions
      .sort((a, b) => (b.paymentDate?.getTime() || 0) - (a.paymentDate?.getTime() || 0))
      .map(renderTransaction)
  );

  /**
   * Component render
   */
  return (
    <>
      <View style={ styles.cardWrapper }>
        <View style={ styles.cardContent }>
          <TouchableOpacity
            onPress={ () => setClosed(!closed) }
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[ theme.fonts.medium, { fontSize: 16 } ]}>
              { `${title} (${transactions.length})` }
            </Text>
            <Icon name="angle-down" size={ 20 }/>
          </TouchableOpacity>
          { closed &&
            <View style={ styles.transactionsList }>
              { renderTransactions() }
            </View>
          }
        </View>
      </View>
    </>
  );
};

export default TransactionsCard;