import React from "react";
import { ScrollView, View, Text, ActivityIndicator, Dimensions, Platform } from "react-native";
import styles from "../../../styles/screens/portfolio/distribution-screen";
import { Portfolio, PortfolioSecurity } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import { PortfolioContext } from "../../providers/portfolio-provider";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { VictoryPie, VictoryTooltip } from "victory-native";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { PortfolioSecurityCategory } from "../../../types";
import GenericUtils from "../../../utils/generic";
import { Card, Switch } from "react-native-paper";
import { FundsApiContext } from "../../providers/funds-api-provider";
import theme from "../../../theme";
import BigNumber from "bignumber.js";
import ChartUtils from "../../../utils/chart";
import Svg from "react-native-svg";
import Calculations from "../../../utils/calculations";

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
  const [ showGroup, setShowGroup ] = React.useState(false);
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
    const name = fund.shortName ? GenericUtils.getLocalizedValue(fund.shortName) : "";

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
   * Renders content
   */
  const renderPie = () => {
    const chartData = portfolioSecurityCategories.map(({ name, percentage, totalValue }) => ({
      x: `${name} - ${percentage}`,
      y: parseFloat(totalValue)
    }));

    const chartColor = showGroup ?
      portfolioSecurityCategories.map(({ groupColor }) => groupColor) :
      portfolioSecurityCategories.map(({ color }) => color);

    /**
     * Renders pie chart
     */
    const pieChart = () => {
      return (
        <VictoryPie
          colorScale={ chartColor }
          data={ chartData }
          radius={ Dimensions.get("window").height / 6 }
          labelRadius={ 40 }
          padAngle={ 3 }
          width={ Dimensions.get("window").width }
          height={ Dimensions.get("window").height / 3 }
          innerRadius={ 40 }
          animate={{ duration: 100, easing: "linear" }}
          labelComponent={
            <VictoryTooltip
              orientation="top"
              constrainToVisibleArea
              flyoutPadding={ 15 }
              renderInPortal={ false }
            />
          }
          events={[
            {
              target: "data",
              eventHandlers: {
                onPressIn: () => [
                  {
                    target: "labels",
                    eventKey: "all",
                    mutation: () => ({ active: false })
                  }
                ],
                onPressOut: () => [
                  {
                    target: "labels",
                    mutation: () => ({ active: true })
                  }
                ]
              }
            },
            {
              target: "labels",
              eventHandlers: {
                onPressIn: () => [
                  {
                    target: "labels",
                    eventKey: "all",
                    mutation: () => ({ active: false })
                  }
                ]
              }
            }
          ]}
        />
      );
    };
      
    return (
      <View style={ styles.chartContainer }>
        { Platform.OS === "ios" &&
          pieChart()
        }
        { Platform.OS === "android" &&
          <Svg style={{ width: Dimensions.get("window").width }}>
            { pieChart() }
          </Svg>
        }
      </View>
    );
  };

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
          backgroundColor: showGroup ?
            portfolioSecurityCategory.groupColor :
            portfolioSecurityCategory.color
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
   * Renders legends
   */
  const renderCategories = () => (
    <Card style={ styles.distributionCard }>
      <ScrollView>
        { portfolioSecurityCategories.map(renderCategory) }
      </ScrollView>
    </Card>
  );

  /**
   * Renders show group color switch
   */
  const renderGroupColorSwitch = () => (
    <View style={ styles.checkBoxContainer }>
      <Text style={{ marginRight: theme.spacing(2) }}>
        { strings.portfolio.distribution.shareInterest }
      </Text>
      <Switch
        color={ theme.colors.primary }
        value={ showGroup }
        onValueChange={ () => setShowGroup(!showGroup) }
      />
    </View>
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
        { renderPie() }
        { renderGroupColorSwitch() }
        { renderCategories() }
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <View style={ styles.viewContainer }>
      { renderContent() }
    </View>
  );
};

export default DistributionsScreen;