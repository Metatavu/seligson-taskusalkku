import React from "react";
import { View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import theme from "../../theme";
import transactionsCardStyles from "../../styles/generic/transactions-card";
import strings from "../../localization/strings";
import { PortfolioTransaction, Fund } from "../../generated/client";
import { TouchableOpacity } from "react-native-gesture-handler";
import auth from "../../utils/auth";
import { FundsApiContext } from "../providers/funds-api-provider";
import { ErrorContext } from "../error-handler/error-handler";
import GenericUtils from "../../utils/generic";
import Icon from "react-native-vector-icons/FontAwesome";
import TestData from "../../resources/test-data";
import { useNavigation } from "@react-navigation/native";
import TransactionsNavigator from "../../types/navigators/transactions";

/**
 * Component properties
 */
interface Props {
  transactionTitle: String;
  portfolioTransactions: PortfolioTransaction[];
}

/**
 * Transactions card
 *
 * @param props component properties
 */
const TransactionsCard: React.FC<Props> = ({ transactionTitle, portfolioTransactions }) => {
  const styles = transactionsCardStyles(useTheme(), "#FFF");
  const sortedTransactions = portfolioTransactions.sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());
  const navigation = useNavigation<TransactionsNavigator.NavigationProps>();
  const transactionsAmount = ` (${portfolioTransactions.length})`;
  
  const fundsApiContext = React.useContext(FundsApiContext);
  const errorContext = React.useContext(ErrorContext);
  
  const [ funds, setFunds ] = React.useState<Fund[]>([]);
  const [closed, setClosed] = React.useState(true);
  
  /**
   * Loads funds from API
   */
  const loadFunds = async () => {
    if (!auth) {
      return;
    }

    try {
      /** TODO: add pagination support */
      /** TODO: change test fund data to real data */
      // setFunds(await fundsApiContext.listFunds({ maxResults: 200 }));
      setFunds(TestData.getTestFunds(20));
    } catch (error) {
      errorContext.setError(strings.errorHandling.funds.list, error);
    }
  };

  /**
   * Effect for loading funds
   */
  React.useEffect(() => { loadFunds(); }, []);

  /**
   * Transaction value
   *
   * @param label
   * @param value 
   */
  const renderTransactionValue = (label: string, value: number) => {
    return (
      <View style={ styles.shareColumn }>
        <Text style={ styles.labelText }>
          { label }
        </Text>
        <Text>
          { value.toFixed(4) }
          { label !== strings.fundDetailsScreen.amount ? "€" : "kpl" }
        </Text>
      </View>
    );
  };

  /**
   * Render transaction
   */
  const renderTransaction = (portfolioTransaction: PortfolioTransaction) => {
    const { fundId, id, paymentDate, marketValue, shareAmount } = portfolioTransaction;
    const i = funds.findIndex(fund => fund.id === fundId);
    const { color, longName } = funds[i];

    return (
      <TouchableOpacity
        key={ id }
        onPress={ () => navigation.navigate("transactionsDetails", { portfolioTransaction: portfolioTransaction, fund: funds[i] }) }
      >
        <View style={ styles.transactionWrapper }>
          <View style={[ styles.colorBar, { backgroundColor: color } ]}/>
          <View style={ styles.transactionContent }>
            <View style={ styles.transactionTitle }>
              <Text style={[ theme.fonts.medium, { flex: 1 } ]}>
                { longName && GenericUtils.getLocalizedValue(longName) }
              </Text>
              <Text style={ styles.labelText }>
                { paymentDate.toLocaleDateString() }
              </Text>
            </View>
            <Divider style={{ marginVertical: 5 }}/>
            <View style={ styles.cardRow }>
              { renderTransactionValue(strings.portfolio.transactions.value, marketValue) }
              { renderTransactionValue(strings.fundDetailsScreen.amount, shareAmount) }
              { renderTransactionValue(strings.portfolio.statistics.total, (marketValue * shareAmount)) }
            </View>
          </View>
        </View>
      </TouchableOpacity>

    );
  };

  /**
   * Render transactions list
   */
  const RenderTransactionList = () => {
    return (
      <View style={ styles.transactionsList }>
        { sortedTransactions.map(renderTransaction) }
      </View>
    );
  };
    
  /**
   * Component render
   */
  return (
    <>
      <View style={ styles.cardWrapper }>
        <View style={ styles.cardContent }>
          <TouchableOpacity
            onPress={ () => (!closed ? setClosed(true) : setClosed(false)) }
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[ theme.fonts.medium, { fontSize: 16 } ]} >
              { transactionTitle }
              { transactionsAmount }
            </Text>
            <Icon name="angle-down" size={ 20 }/>
          </TouchableOpacity>
          { closed ? <RenderTransactionList/> : null }
        </View>
      </View>
    </>
  );
};

export default TransactionsCard;