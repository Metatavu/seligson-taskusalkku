import React from "react";
import { View } from "react-native";
import TransactionsCard from "../../generic/transactions-card";
import theme from "../../../theme";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Fund, Portfolio, PortfolioTransaction, Security, TransactionType } from "../../../generated/client";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/auth-slice";
import { ErrorContext } from "../../error-handler/error-handler";
import strings from "../../../localization/strings";
import { PortfolioContext } from "../../providers/portfolio-context-provider";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../../styles/screens/portfolio/transactions-list";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { FundsApiContext } from "../../providers/funds-api-provider";

/**
 * Transactions list
 */
const TransactionsList: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  const errorContext = React.useContext(ErrorContext);
  const portfolioContext = React.useContext(PortfolioContext);
  const fundsContext = React.useContext(FundsApiContext);
  const securitiesContext = React.useContext(SecuritiesApiContext);
  const portfoliosContext = React.useContext(PortfoliosApiContext);

  const [ funds, setFunds ] = React.useState<Fund[]>([]);
  const [ securities, setSecurities ] = React.useState<Security[]>([]);
  const [ transactions, setTransactions ] = React.useState<PortfolioTransaction[]>([]);

  /**
   * Filters transactions by type
   *
   * @param type transaction type
   */
  const filterTransactionsByType = (type: TransactionType) => (
    transactions.filter(({ transactionType }) => transactionType === type)
  );

  /**
   * Loads funds from API
   */
  const loadFunds = async () => {
    if (!auth) {
      return;
    }

    try {
      setFunds(await fundsContext.listFunds({}));
    } catch (error) {
      errorContext.setError(strings.errorHandling.funds.list, error);
    }
  };

  /**
   * Loads securities from API
   *
   * @param selectedPortfolio selected portfolio
   */
  const loadSecurities = async (selectedPortfolio: Portfolio) => {
    if (!auth || !selectedPortfolio.id) {
      return;
    }

    try {
      setSecurities(await securitiesContext.listSecurities({}));
    } catch (error) {
      errorContext.setError(strings.errorHandling.securities.list, error);
    }
  };

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
      setTransactions(await portfoliosContext.listPortfolioTransactions({ portfolioId: selectedPortfolio.id }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolioTransactions.list, error);
    }
  };

  /**
   * Effect for loading funds
   */
  React.useEffect(() => {
    loadFunds();
  }, []);

  /**
   * Effect for loading securities and transactions
   */
  React.useEffect(() => {
    const { selectedPortfolio } = portfolioContext;
    if (selectedPortfolio) {
      loadSecurities(selectedPortfolio);
      loadTransactions(selectedPortfolio);
    }
  }, [ portfolioContext.selectedPortfolio ]);

  /**
   * Transaction filter button
   * TODO: add date filtering functionality
   */
  const renderFilterButton = () => (
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

  /**
   * Redemption transactions
   */
  const renderRedemptions = () => (
    <TransactionsCard
      title={ strings.portfolio.statistics.redemptions }
      funds={ funds }
      securities={ securities }
      transactions={ filterTransactionsByType(TransactionType.Redemption) }
    />
  );

  /**
   * Subscription transactions
   */
  const renderSubscriptions = () => (
    <TransactionsCard
      title={ strings.portfolio.statistics.subscriptions }
      funds={ funds }
      securities={ securities }
      transactions={ filterTransactionsByType(TransactionType.Subscription) }
    />
  );

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.transactionsWrapper }>
        { renderFilterButton() }
        { renderRedemptions() }
        { renderSubscriptions() }
      </View>
    </ScrollView>
  );
};

export default TransactionsList;