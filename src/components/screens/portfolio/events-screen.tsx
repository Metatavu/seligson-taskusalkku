import React from "react";
import { View } from "react-native";
import TransactionsCard from "../../generic/transactions-card";
import theme from "../../../theme";
import { ScrollView } from "react-native-gesture-handler";
import { Portfolio, PortfolioTransaction, TransactionType } from "../../../generated/client";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/auth-slice";
import { ErrorContext } from "../../error-handler/error-handler";
import strings from "../../../localization/strings";
import { PortfolioTransactionsApiContext } from "../../providers/portfolio-transactions-api-provider";
import { PortfolioContext } from "./portfolio-context-provider";

/**
 * Events screen
 */
const EventsScreen: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  const errorContext = React.useContext(ErrorContext);
  const portfolioContext = React.useContext(PortfolioContext);
  const portfolioTransactionsContext = React.useContext(PortfolioTransactionsApiContext);

  const [ transactions, setTransactions ] = React.useState<PortfolioTransaction[]>([]);

  /**
 * Loads transactions from API
 */
  const loadTransactions = async (selectedPortfolio: Portfolio) => {
    if (!auth || !selectedPortfolio.id) {
      return;
    }

    try {
      /** TODO: add pagination support */
      setTransactions(await portfolioTransactionsContext.listPortfolioTransactions({ portfolioId: selectedPortfolio.id }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.funds.list, error);
    }
  };

  /**
   * Effect for loading transactiosn
   */
  React.useEffect(() => {
    const { selectedPortfolio } = portfolioContext;
    if (!selectedPortfolio) {
      return;
    }

    loadTransactions(selectedPortfolio);
  }, [ portfolioContext.selectedPortfolio ]);
  
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
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          padding: theme.spacing(2)
        }}
      >
        { filteredTransactionsRedemptions() }
        { filteredTransactionsSubscriptions() }
      </View>
    </ScrollView>
  );
};

export default EventsScreen;