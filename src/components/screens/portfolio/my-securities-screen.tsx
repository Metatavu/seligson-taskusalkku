import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { Fund, Portfolio, PortfolioSecurity, Security } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import { PortfolioContext } from "../../providers/portfolio-provider";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import styles from "../../../styles/screens/portfolio/my-funds-screen";
import theme from "../../../theme";
import PortfolioSecurityCard from "../../generic/portfolio-security-card";
import { FundsApiContext } from "../../providers/funds-api-provider";

/**
 * My security info
 */
interface MySecurityInfo {
  portfolioSecurity: PortfolioSecurity;
  security: Security;
  fund: Fund;
}

/**
 * My securities screen component
 */
const MySecuritiesScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);
  const portfolioContext = React.useContext(PortfolioContext);
  const securitiesApiContext = React.useContext(SecuritiesApiContext);
  const fundsApiContext = React.useContext(FundsApiContext);
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);

  const [ loading, setLoading ] = React.useState(true);
  const [ mySecurities, setMySecurities ] = React.useState<MySecurityInfo[]>([]);

  /**
   * Loads portfolio security info
   *
   * @param portfolioSecurity portfolio security ID
   */
  const loadPortfolioSecurityInfo = async (portfolioSecurity: PortfolioSecurity): Promise<MySecurityInfo> => {
    const security = await securitiesApiContext.findSecurity({ securityId: portfolioSecurity.id });
    const fund = await fundsApiContext.findFund({ fundId: security.fundId });

    return {
      portfolioSecurity: portfolioSecurity,
      security: security,
      fund: fund
    };
  };

  /**
   * Loads my securities
   *
   * @param selectedPortfolio selected portfolio from context
   */
  const loadMySecurities = async (selectedPortfolio?: Portfolio) => {
    if (!selectedPortfolio?.id) {
      return;
    }

    try {
      const portfolioSecurities = await portfoliosApiContext.listPortfolioSecurities({ portfolioId: selectedPortfolio.id });
      console.log(portfolioSecurities);
      setMySecurities(await Promise.all(portfolioSecurities.map(loadPortfolioSecurityInfo)));
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolioSecurities.list, error);
    }

    setLoading(false);
  };

  /**
   * Effect for loading my funds when selected portfolio changes in portfolio context
   */
  React.useEffect(() => {
    loadMySecurities(portfolioContext.selectedPortfolio);
  }, [ portfolioContext.selectedPortfolio ]);

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

    return (
      <View>
        <View>
          <Text>
            { strings.portfolio.portfolioSecurities.title }
          </Text>
        </View>
        { mySecurities.map(PortfolioSecurityCard) }
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.viewContainer }>
        <LinearGradient
          colors={[ "transparent", "rgba(0,0,0,0.5)" ]}
        />
        { renderContent() }
      </View>
    </ScrollView>
  );
};

export default MySecuritiesScreen;