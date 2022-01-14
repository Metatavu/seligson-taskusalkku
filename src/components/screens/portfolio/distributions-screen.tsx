import React from "react";
import { ScrollView, View, Text, ActivityIndicator, Dimensions } from "react-native";
import styles from "../../../styles/screens/portfolio/distribution-screen";
import { Portfolio, PortfolioSecurity } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import { PortfolioContext } from "../../providers/portfolio-provider";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { VictoryLabel, VictoryPie } from "victory-native";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { PortfolioSecurityCategory } from "../../../types";
import GenericUtils from "../../../utils/generic";
import { Card } from "react-native-paper";
import { FundsApiContext } from "../../providers/funds-api-provider";
import theme from "../../../theme";
import BigNumber from "bignumber.js";

/**
 * Distributions screen component
 */
const DistributionsScreen: React.FC = () => {
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
   * @param totalAmount total amount
   */
  const fetchSecurityFund = (totalAmount: BigNumber) => async (portfolioSecurity: PortfolioSecurity): Promise<PortfolioSecurityCategory> => {
    const security = await securityApiContext.findSecurity({ securityId: portfolioSecurity.id });
    const fund = await fundsApiContext.findFund({ fundId: security.fundId });

    return {
      fundId: security.fundId,
      name: security.name,
      currency: security.currency,
      color: fund.color || "",
      totalValue: portfolioSecurity.totalValue,
      percentage: `${(new BigNumber(portfolioSecurity.totalValue)).dividedBy(totalAmount).multipliedBy(100).toFormat(2)} %`
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
   * 
   * @param categories categories 
   */
  const aggregateSecurityCategories = (categories: PortfolioSecurityCategory[]): PortfolioSecurityCategory[] => {
    const securityMap = new Map<string, PortfolioSecurityCategory>();
  
    let sumValue = new BigNumber("0");
    categories.forEach(category => {
      const storedCategory = securityMap.get(category.fundId);

      const currentNumber = new BigNumber(category.totalValue);
      const updatedCategory: PortfolioSecurityCategory = {
        ...category,
        totalValue: new BigNumber(storedCategory?.totalValue || "0").plus(currentNumber).toString()
      };
      sumValue = sumValue.plus(currentNumber);
      securityMap.set(updatedCategory.fundId, updatedCategory);
    });

    const aggregatedList = Array.from(securityMap.values());
    return aggregatedList.map(category => ({
      ...category,
      percentage: `${(new BigNumber(category.totalValue)).dividedBy(sumValue).multipliedBy(100).toFormat(2)} %`
    }));
  };

  /**
   * Fetch securities of a portfolio
   */
  const fetchAllPortfolioSecurities = async () => {
    try {
      const portfolios = await portfoliosApiContext.listPortfolios();
      const categoryLists = await Promise.all(portfolios.map(fetchPortfolioSecurities));
      const categoryList = categoryLists.reduce((prev, cur) => prev.concat(cur), []);

      return aggregateSecurityCategories(categoryList);
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
    if (selectedPortfolio) {
      setPortfolioSecurityCategories(await fetchPortfolioSecurities(selectedPortfolio));
    } else {
      setPortfolioSecurityCategories(await fetchAllPortfolioSecurities());
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, [ selectedPortfolio ]);

  /**
   * Renders content
   */
  const renderPie = () => {
    const chartData = portfolioSecurityCategories.map(portfolioSecurityCategory => (
      {
        x: `${GenericUtils.getLocalizedValue(portfolioSecurityCategory.name).split(" ")[0]}- ${portfolioSecurityCategory.percentage}`,
        y: parseFloat(portfolioSecurityCategory.totalValue)
      }));

    const chartColor = portfolioSecurityCategories.map(portfolioSecurityCategory => portfolioSecurityCategory.color);

    return (
      <View style={ styles.chartContainer }>
        <VictoryPie
          colorScale={ chartColor }
          data={ chartData }
          radius={ 120 }
          labelRadius={ 80 }
          width={ Dimensions.get("window").width }
          height={ 300 }
          animate={{ duration: 2000 }}
          labelComponent={ <VictoryLabel style={{ fontSize: 12 }}/> }
        />
      </View>
    );
  };

  /**
   * Renders securities category
   * 
   * @param portfolioSecurityCategory portfolio security category
   */
  const renderCategory = (portfolioSecurityCategory: PortfolioSecurityCategory) => (
    <View style={ styles.securityCategory }>
      <View
        style={{ ...styles.categoryColor, backgroundColor: portfolioSecurityCategory.color }}
      />
      <Text style={{ flexWrap: "wrap" }}>{ `${portfolioSecurityCategory.percentage} ${GenericUtils.getLocalizedValue(portfolioSecurityCategory.name)}` }</Text>
    </View>
  );

  /**
   * Renders legends
   */
  const renderCategories = () => {
    return (
      <Card style={ styles.distributionCard }>
        { portfolioSecurityCategories.map(renderCategory) }
      </Card>
    );
  };

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
        { renderPie() }
        { renderCategories() }
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