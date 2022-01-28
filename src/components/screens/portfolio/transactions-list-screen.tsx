import React from "react";
import { View, Text } from "react-native";
import TransactionsCard from "../../generic/transactions-card";
import theme from "../../../theme";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Fund, PortfolioTransaction, Security, TransactionType } from "../../../generated/client";
import { ErrorContext } from "../../error-handler/error-handler";
import strings from "../../../localization/strings";
import { PortfolioContext } from "../../providers/portfolio-provider";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../../styles/screens/portfolio/transactions-list";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { FundsApiContext } from "../../providers/funds-api-provider";
import DatePicker from "../../generic/date-picker";
import moment from "moment";
import GenericUtils from "../../../utils/generic";

/**
 * Transactions list screen component
 */
const TransactionsListScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);
  const { portfolios, selectedPortfolio, getEffectivePortfolios } = React.useContext(PortfolioContext);
  const fundsContext = React.useContext(FundsApiContext);
  const securitiesContext = React.useContext(SecuritiesApiContext);
  const portfoliosContext = React.useContext(PortfoliosApiContext);

  const [ funds, setFunds ] = React.useState<Fund[]>([]);
  const [ securities, setSecurities ] = React.useState<Security[]>([]);
  const [ transactions, setTransactions ] = React.useState<PortfolioTransaction[]>([]);
  const [ startDate, setStartDate ] = React.useState<Date>();
  const [ endDate, setEndDate ] = React.useState<Date>();

  /**
   * Filters transactions
   *
   * @param type transaction type
   */
  const filterTransactions = (type: TransactionType) => {
    const filteredByType = transactions.filter(({ transactionType }) => transactionType === type);
    const filteredByDate = filteredByType.filter(transaction => GenericUtils.checkDateInRange(transaction.paymentDate, startDate, endDate));

    return filteredByDate;
  };

  /**
   * Loads funds from API
   */
  const loadFunds = async () => {
    try {
      setFunds(await fundsContext.listFunds({ maxResults: 100 }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.funds.list, error);
    }
  };

  /**
   * Loads securities from API
   */
  const loadSecurities = async () => {
    try {
      setSecurities(await securitiesContext.listSecurities({ maxResults: 100 }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.securities.list, error);
    }
  };

  /**
   * Loads transactions from API
   *
   * TODO: add pagination support
   */
  const loadTransactions = async () => {
    const effectivePortfolios = getEffectivePortfolios().filter(({ id }) => !!id);

    try {
      setTransactions(
        (await Promise.all(
          effectivePortfolios.map(
            async portfolio => portfoliosContext.listPortfolioTransactions({ portfolioId: portfolio.id! })
          )
        )).flat()
      );
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
    loadSecurities();
    loadTransactions();
  }, [ portfolios, selectedPortfolio ]);

  /**
   * Renders date pickers
   *
   * TODO: add date filtering functionality
   */
  const renderStartDatePicker = () => (
    <>
      <DatePicker
        mode="date"
        date={ startDate || new Date() }
        onDateChange={ setStartDate }
      />
    </>
  );

  /**
   * Renders date pickers
   *
   * TODO: add date filtering functionality
   */
  const renderEndDatePicker = () => (
    <>
      <DatePicker
        mode="date"
        date={ endDate || new Date() }
        onDateChange={ setEndDate }
        startDate={ startDate }
      />
    </>
  );

  /**
   * Redemption transactions
   */
  const renderRedemptions = () => (
    <TransactionsCard
      title={ strings.portfolio.statistics.redemptions }
      funds={ funds }
      securities={ securities }
      transactions={ filterTransactions(TransactionType.Redemption) }
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
      transactions={ filterTransactions(TransactionType.Subscription) }
    />
  );

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.transactionsWrapper }>
        <View style={ styles.datePickers }>
          { renderStartDatePicker() }
          { renderEndDatePicker() }
        </View>
        { renderRedemptions() }
        { renderSubscriptions() }
      </View>
    </ScrollView>
  );
};

export default TransactionsListScreen;