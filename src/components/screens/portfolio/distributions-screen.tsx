import React from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import styles from "../../../styles/screens/portfolio/distribution-screen";
import { Portfolio, PortfolioSecurity } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import { PortfolioContext } from "../../providers/portfolio-provider";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { PortfolioSecurityCategory } from "../../../types";
import GenericUtils from "../../../utils/generic";
import { Card } from "react-native-paper";
import { FundsApiContext } from "../../providers/funds-api-provider";
import theme from "../../../theme";
import BigNumber from "bignumber.js";
import ChartUtils from "../../../utils/chart";
import Calculations from "../../../utils/calculations";
import { useHardwareGoBack } from "../../../app/hooks";

/**
 * Distributions screen component
 */
const DistributionsScreen: React.FC = () => {
  useHardwareGoBack();
  const portfolioContext = React.useContext(PortfolioContext);
  const { selectedPortfolio } = portfolioContext;
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const securityApiContext = React.useContext(SecuritiesApiContext);
  const fundsApiContext = React.useContext(FundsApiContext);
  const errorContext = React.useContext(ErrorContext);

  const [ portfolioSecurityCategories, setPortfolioSecurityCategories ] = React.useState<PortfolioSecurityCategory[]>([]);
  const [ loading, setLoading ] = React.useState(true);

  /**
   * Fetch and preprocess a security
   *
   * @param totalValue total value
   */
  const fetchSecurityFund = (totalValue: BigNumber) => async (portfolioSecurity: PortfolioSecurity): Promise<PortfolioSecurityCategory> => {
    const security = await securityApiContext.findSecurity({ securityId: portfolioSecurity.id });
    const fund = await fundsApiContext.findFund({ fundId: security.fundId });
    const percentage = new BigNumber(portfolioSecurity.totalValue).dividedBy(totalValue).multipliedBy(100);
    const name = GenericUtils.getLocalizedValue(fund.shortName);

    return {
      fundId: security.fundId,
      name: name,
      currency: security.currency,
      color: fund.color || "",
      totalValue: portfolioSecurity.totalValue,
      percentage: Calculations.formatPercentageNumberStr(percentage),
      groupColor: GenericUtils.getFundGroupColor(fund.group)
    };
  };

  /**
   * Fetch securities of a portfolio
   *
   * @param portfolio portfolio
   */
  const fetchPortfolioSecurities = async (portfolio: Portfolio): Promise<PortfolioSecurityCategory[]> => {
    if (!portfolio.id) {
      return [];
    }

    try {
      const portfolioSecurities = await portfoliosApiContext.listPortfolioSecurities({ portfolioId: portfolio?.id });
      const totalValue = portfolioSecurities.reduce((prev, cur) => (new BigNumber(cur.totalValue)).plus(prev), new BigNumber("0"));
      return await Promise.all(portfolioSecurities.map(fetchSecurityFund(totalValue)));
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolioSecurities.list, error);
    }

    return [];
  };

  /**
   * Fetch securities of a portfolio
   */
  const fetchAllPortfolioSecurities = async () => {
    try {
      const portfolios = await portfoliosApiContext.listPortfolios();
      const categoryLists = await Promise.all(portfolios.map(fetchPortfolioSecurities));
      const categoryList = categoryLists.reduce((prev, cur) => prev.concat(cur), []);

      return ChartUtils.aggregateSecurityCategories(categoryList);
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }

    return [];
  };

  /**
   * Fetch securities of a portfolio
   */
  const loadData = async () => {
    setLoading(true);
    const fetchedPortfolioSecurities = selectedPortfolio ? await fetchPortfolioSecurities(selectedPortfolio) : await fetchAllPortfolioSecurities();

    setPortfolioSecurityCategories(fetchedPortfolioSecurities.sort(ChartUtils.compareSecurityCategory).reverse());
    setLoading(false);
  };

  /**
   * Effect that loads data
   */
  React.useEffect(() => { loadData(); }, [ selectedPortfolio ]);
  
  /**
   * Renders securities category
   *
   * @param portfolioSecurityCategory portfolio security category
   * @param index index
   */
  const renderCategory = (portfolioSecurityCategory: PortfolioSecurityCategory, index: number) => (
    <View
      key={ index }
      style={ styles.securityCategory }
    >
      <View
        style={{
          ...styles.categoryColor,
          backgroundColor: portfolioSecurityCategory.color
        }}
      />
      <View>
        <Text style={ theme.fonts.medium }>
          { portfolioSecurityCategory.percentage }
        </Text>
        <Text>
          { portfolioSecurityCategory.name }
        </Text>
      </View>
    </View>
  );

  /**
   * Renders categories
   */
  const renderCategories = () => (
    <Card style={ styles.distributionCard }>
      { portfolioSecurityCategories.map(renderCategory) }
    </Card>
  );

  /**
   * Renders legend
   */
  const renderlegend = (color: string, legend: string) => (
    <View style={ styles.legendRow }>
      <View
        style={{
          ...styles.categoryColor,
          backgroundColor: color
        }}
      />
      <Text style={ theme.fonts.medium }>
        { legend }
      </Text>
    </View>
  );

  /**
   * Renders legends
   */
  const renderLegends = () => (
    <Card style={[ styles.distributionCard, { marginTop: theme.spacing(2) } ]}>
      { renderlegend("rgb(200, 40, 40)", "Osakerahastot") }
      { renderlegend("rgb(230, 130, 40)", "Yhdistelmärahastot") }
      { renderlegend("rgb(80, 140, 80)", "korkorahastot") }
    </Card>
  );

  /**
   * Renders content
   */
  const renderContent = () => {
    if (loading) {
      return (
        <View style={ styles.loaderContainer }>
          <ActivityIndicator size="large" color={ theme.colors.primary }/>
        </View>
      );
    }

    if (!portfolioSecurityCategories.length) {
      return (
        <View style={ styles.loaderContainer }>
          <Text>{ strings.generic.noData }</Text>
        </View>
      );
    }

    return (
      <>
        { renderCategories() }
        { renderLegends() }
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.viewContainer }>
        { renderContent() }
      </View>
    </ScrollView>
  );
};

export default DistributionsScreen;