import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import TransactionsCard from "../../generic/transactions-card";
import { ScrollView } from "react-native-gesture-handler";
import { Fund, Portfolio, PortfolioTransaction, Security, TransactionType } from "../../../generated/client";
import { ErrorContext } from "../../error-handler/error-handler";
import strings from "../../../localization/strings";
import { PortfolioContext } from "../../providers/portfolio-provider";
import styles from "../../../styles/screens/portfolio/transactions-list";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { FundsApiContext } from "../../providers/funds-api-provider";
import DatePicker from "../../generic/date-picker";
import GenericUtils from "../../../utils/generic";
import moment from "moment";
import theme from "../../../theme";
import { useHardwareGoBack } from "../../../app/hooks";
import { CompanyContext } from "../../providers/company-provider";

/**
 * Transactions screen component
 */
const TransactionsScreen: React.FC = () => {
  useHardwareGoBack();
  const errorContext = React.useContext(ErrorContext);
  const { portfolios, selectedPortfolio, getEffectivePortfolios } = React.useContext(PortfolioContext);
  const fundsContext = React.useContext(FundsApiContext);
  const securitiesContext = React.useContext(SecuritiesApiContext);
  const portfoliosContext = React.useContext(PortfoliosApiContext);
  const { selectedCompany } = React.useContext(CompanyContext);
  const [ loading, setLoading ] = React.useState(true);
  const [ funds, setFunds ] = React.useState<Fund[]>([]);
  const [ securities, setSecurities ] = React.useState<Security[]>([]);
  const [ transactions, setTransactions ] = React.useState<PortfolioTransaction[]>([]);
  const [ startDate, setStartDate ] = React.useState<Date>(moment().startOf("year").toDate());
  const [ endDate, setEndDate ] = React.useState<Date>(new Date());

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

    setLoading(false);
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
   */
  const loadTransactions = async (effectivePortfolios: Portfolio[]) => {
    try {
      const effectivePortfolioLists = await Promise.all(
        effectivePortfolios.map(
          async portfolio => portfoliosContext.listPortfolioTransactions({
            portfolioId: portfolio.id!,
            startDate: startDate,
            endDate: endDate
          })
        )
      );

      setTransactions(effectivePortfolioLists.flat());
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolioTransactions.list, error);
    }
  };

  /**
   * Loads securities and transactions
   */
  const loadSecuritiesAndTransactions = async () => {
    const effectivePortfolios = getEffectivePortfolios(selectedCompany)?.filter(({ id }) => !!id);

    if (!effectivePortfolios) return;

    setLoading(true);

    await loadSecurities();
    await loadTransactions(effectivePortfolios);

    setLoading(false);
  };

  /**
   * Effect for loading funds
   */
  React.useEffect(() => { loadFunds(); }, []);

  /**
   * Effect for loading securities and transactions
   */
  React.useEffect(() => {
    !!portfolios && loadSecuritiesAndTransactions();
  }, [ portfolios, selectedPortfolio, selectedCompany, startDate, endDate ]);

  /**
   * Renders date pickers
   */
  const renderStartDatePicker = () => (
    <DatePicker
      mode="date"
      date={ startDate }
      onDateChange={ setStartDate }
      maxDate={ endDate }
    />
  );

  /**
   * Renders date pickers
   */
  const renderEndDatePicker = () => (
    <DatePicker
      mode="date"
      date={ endDate }
      onDateChange={ setEndDate }
      startDate={ startDate }
      maxDate={ new Date() }
    />
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
   * Security transactions
   */
  const renderSecurities = () => (
    <TransactionsCard
      title={ strings.portfolio.statistics.securities }
      funds={ funds }
      securities={ securities }
      transactions={ filterTransactions(TransactionType.Security) }
    />
  );

  /**
   * Renders redemptions and subscriptions
   */
  const renderRedemptionsAndSubscriptions = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={ theme.colors.primary }/>;
    }

    return (
      <>
        { renderRedemptions() }
        { renderSubscriptions() }
        { renderSecurities() }
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.transactionsWrapper }>
        <View style={ styles.datePickers }>
          { renderStartDatePicker() }
          <Text>
            -
          </Text>
          { renderEndDatePicker() }
        </View>
        { renderRedemptionsAndSubscriptions() }
      </View>
    </ScrollView>
  );
};

export default TransactionsScreen;