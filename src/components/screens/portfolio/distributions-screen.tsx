import React from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import styles from "../../../styles/screens/portfolio/distribution-screen";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import { PortfolioContext } from "../../providers/portfolio-provider";
import { PortfolioSecurityCategory } from "../../../types";
import { Card } from "react-native-paper";
import theme from "../../../theme";
import ChartUtils from "../../../utils/chart";
import { useHardwareGoBack } from "../../../app/hooks";
import { CompanyContext } from "../../providers/company-provider";

/**
 * Distributions screen component
 */
const DistributionsScreen: React.FC = () => {
  useHardwareGoBack();
  const {
    selectedPortfolio,
    getEffectivePortfolios,
    fetchPortfolioSecurities,
    saveCategories,
    savedCategories,
    setCategoriesLoaderParams
  } = React.useContext(PortfolioContext);
  const { selectedCompany } = React.useContext(CompanyContext);
  const errorContext = React.useContext(ErrorContext);

  const [ portfolioSecurityCategories, setPortfolioSecurityCategories ] = React.useState<PortfolioSecurityCategory[]>([]);
  const [ loading, setLoading ] = React.useState(true);

  /**
   * Fetch securities of a portfolio
   */
  const fetchAllPortfolioSecurities = async () => {
    try {
      const categoryLists = await Promise.all((getEffectivePortfolios(selectedCompany) || []).map(fetchPortfolioSecurities));
      const categoryList = categoryLists.reduce((prev, cur) => prev.concat(cur), []);

      return ChartUtils.aggregateSecurityCategories(categoryList);
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }

    return [];
  };

  /**
   * Get securities
   */
  const getSecurities = async () => {
    if (savedCategories.length > 0) {
      return savedCategories;
    }

    return selectedPortfolio ? fetchPortfolioSecurities(selectedPortfolio) : fetchAllPortfolioSecurities();
  };

  /**
   * Fetch securities of a portfolio
   */
  const loadData = async () => {
    setCategoriesLoaderParams({ effectivePortfolios: getEffectivePortfolios(selectedCompany) });
    setLoading(true);
    const fetchedPortfolioSecurities = await getSecurities();
    saveCategories(fetchedPortfolioSecurities);
    setPortfolioSecurityCategories(fetchedPortfolioSecurities.sort(ChartUtils.compareSecurityCategory).reverse());
    setLoading(false);
  };

  /**
   * Effect that loads data
   */
  React.useEffect(() => { loadData(); }, [ selectedPortfolio, selectedCompany ]);

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
   * 
   * @param color color
   * @param legend legend
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
      { renderlegend("rgb(200, 40, 40)", strings.portfolio.distribution.equityFunds) }
      { renderlegend("rgb(230, 130, 40)", strings.portfolio.distribution.combinationFunds) }
      { renderlegend("rgb(80, 140, 80)", strings.portfolio.distribution.fixedIncomeFunds) }
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