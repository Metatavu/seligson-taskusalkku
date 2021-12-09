import React from "react";
import { View } from "react-native";
import TransactionsCard from "../../generic/transactions-card";
import theme from "../../../theme";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Portfolio, PortfolioTransaction, TransactionType } from "../../../generated/client";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/auth-slice";
import { ErrorContext } from "../../error-handler/error-handler";
import strings from "../../../localization/strings";
import { PortfolioTransactionsApiContext } from "../../providers/portfolio-transactions-api-provider";
import { PortfolioContext } from "./portfolio-context-provider";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../../styles/screens/portfolio/transactions-list";

/**
 * Transactions list
 */
const TransactionsList: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  const errorContext = React.useContext(ErrorContext);
  const portfolioContext = React.useContext(PortfolioContext);
  const portfolioTransactionsContext = React.useContext(PortfolioTransactionsApiContext);

  const [ transactions, setTransactions ] = React.useState<PortfolioTransaction[]>([]);

  /**
 * Loads transactions from API
 *
 * @param selectedPortfolio selected portfolio
 */
  const loadTransactions = async (selectedPortfolio: Portfolio) => {
    if (!auth || !selectedPortfolio.id) {
      return;
    }

    try {
      /** TODO: add pagination support */
      setTransactions(await portfolioTransactionsContext.listPortfolioTransactions({ portfolioId: selectedPortfolio.id }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolioTransactions.list, error);
    }
  };

  /**
   * Effect for loading transactiosn
   */
  React.useEffect(() => {
    const { selectedPortfolio } = portfolioContext;
    selectedPortfolio && loadTransactions(selectedPortfolio);
  }, [ portfolioContext.selectedPortfolio ]);

  /**
   * Transaction filter button
   * TODO: add date filtering functionality
   */
  const transactionFilterButton = () => {
    return (
      <View>
        <TouchableOpacity style={ styles.filterButton }>
          <Icon
            name="calendar"
            size={ 20 }
            color={ theme.colors.grey.A400 }
          />
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Redemption transactions
   */
  const filteredTransactionsRedemptions = () => (
    <TransactionsCard
      key="transactionsCardRedemptions"
      transactionTitle={ strings.portfolio.statistics.redemptions }
      portfolioTransactions={ transactions.filter(transaction => transaction.type === TransactionType.Redemption) }
    />
  );

  /**
   * Subscription transactions
   */
  const filteredTransactionsSubscriptions = () => (
    <TransactionsCard
      key="transactionsCardSubscriptions"
      transactionTitle={ strings.portfolio.statistics.subscriptions }
      portfolioTransactions={ transactions.filter(transaction => transaction.type === TransactionType.Subscription) }
    />
  );

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.transactionsWrapper }>
        { transactionFilterButton() }
        { filteredTransactionsRedemptions() }
        { filteredTransactionsSubscriptions() }
      </View>
    </ScrollView>
  );
};

export default TransactionsList;