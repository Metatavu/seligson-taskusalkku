import React from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import styles from "../../../styles/screens/portfolio/distribution-screen";
import { PortfolioSecurity } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import { PortfolioContext } from "../../providers/portfolio-provider";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { VictoryLabel, VictoryPie } from "victory-native";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { PortfolioSecurityLegend } from "../../../types";
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

  const [ portfolioSecurityLegends, setPortfolioSecurityLegends ] = React.useState<PortfolioSecurityLegend[]>([]);
  const [ loading, setLoading ] = React.useState(true);

  /**
   * Fetch and preprocess a security 
   */
  const fetchSecurityFund = (totalAmount: BigNumber) => async (portfolioSecurity: PortfolioSecurity): Promise<PortfolioSecurityLegend> => {
    const security = await securityApiContext.findSecurity({ securityId: portfolioSecurity.id });
    const fund = await fundsApiContext.findFund({ fundId: security.fundId });

    return {
      name: security.name,
      currency: security.currency,
      color: fund.color || "",
      totalValue: portfolioSecurity.totalValue,
      percentage: `${(new BigNumber(portfolioSecurity.amount)).dividedBy(totalAmount).multipliedBy(100).toFormat(2)} %`
    };
  };

  /**
   * Fetch securities of a portfolio
   */
  const fetchPortfolioSecurities = async () => {
    if (!selectedPortfolio?.id) {
      return;
    }

    try {
      const portfolioSecurities = await portfoliosApiContext.listPortfolioSecurities({ portfolioId: selectedPortfolio?.id });
      const totalValue = portfolioSecurities.reduce((prev, cur) => (new BigNumber(cur.amount)).plus(prev), new BigNumber("0"));
      setPortfolioSecurityLegends(await Promise.all(portfolioSecurities.map(fetchSecurityFund(totalValue))));
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolioSecurities.list, error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchPortfolioSecurities();
  }, [ selectedPortfolio ]);

  /**
   * Renders content
   */
  const renderPie = () => {
    const chartData = portfolioSecurityLegends.map(portfolioSecurityLegend => (
      {
        x: `${GenericUtils.getLocalizedValue(portfolioSecurityLegend.name)} ${portfolioSecurityLegend.percentage}`,
        y: parseFloat(portfolioSecurityLegend.totalValue)
      }));

    const chartColor = portfolioSecurityLegends.map(portfolioSecurityLegend => portfolioSecurityLegend.color);

    return (
      <Card style={ styles.distributionCard }>
        <View style={ styles.chartContainer }>
          <VictoryPie
            colorScale={ chartColor }
            data={ chartData }
            radius={ 120 }
            labelRadius={ 60 }
            animate={{ duration: 2000 }}
            labelComponent={ <VictoryLabel style={{ fontSize: 12 }}/> }
          />
        </View>
      </Card>
    );
  };

  /**
   * Renders legend
   * 
   * @param portfolioSecurityLegend portfolio security legend
   */
  const renderLegend = (portfolioSecurityLegend: PortfolioSecurityLegend) => (
    <View style={ styles.securityLegend }>
      <View
        style={{ ...styles.legendColor, backgroundColor: portfolioSecurityLegend.color }}
      />
      <Text style={{ marginRight: theme.spacing(1) }}>{ portfolioSecurityLegend.percentage }</Text>
      <Text>{ GenericUtils.getLocalizedValue(portfolioSecurityLegend.name) }</Text>
    </View>
  );

  /**
   * Renders legends
   */
  const renderLegends = () => {
    return (
      <Card style={{ ...styles.distributionCard, marginTop: theme.spacing(2) }}>
        { portfolioSecurityLegends.map(renderLegend) }
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

    if (!portfolioSecurityLegends.length) {
      return (
        <View style={ styles.loaderContainer }>
          <Text>{ strings.generic.noData }</Text>
        </View>
      );
    }

    return (
      <>
        { renderPie() }
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