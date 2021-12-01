import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { Fund, Portfolio, PortfolioFund } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ErrorContext } from "../../error-handler/error-handler";
import styles from "../../../styles/screens/portfolio/my-funds-screen";
import theme from "../../../theme";
import PortfolioFundCard from "../../generic/portfolio-fund-card";
import { FundsApiContext } from "../../providers/funds-api-provider";
import { PortfolioFundsApiContext } from "../../providers/portfolio-funds-api-provider";
import { PortfolioContext } from "./portfolio-context-provider";

/**
 * My funds screen
 */
const MyFundsScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);
  const portfolioContext = React.useContext(PortfolioContext);
  const fundsApiContext = React.useContext(FundsApiContext);
  const portfolioFundsApiContext = React.useContext(PortfolioFundsApiContext);

  const [ loading, setLoading ] = React.useState(true);
  const [ selectedPortfolio, setSelectedPortfolio ] = React.useState<Portfolio>();
  const [ portfolioFunds, setPortfolioFunds ] = React.useState<PortfolioFund[]>([]);
  const [ funds, setFunds ] = React.useState<Fund[]>([]);

  /**
   * Loads my funds
   */
  const loadMyFunds = async () => {
    if (!selectedPortfolio?.id) {
      return;
    }

    try {
      const allPortfolioFunds = await portfolioFundsApiContext.listPortfolioFunds({ portfolioId: selectedPortfolio.id });
      setPortfolioFunds(allPortfolioFunds);
      setFunds(await Promise.all(allPortfolioFunds.map(fund => fundsApiContext.findFund({ fundId: fund.id }))));
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolioFunds.list, error);
    }

    setLoading(false);
  };

  /**
   * Effect for loading my funds when selected portfolio changes in portfolio context
   */
  React.useEffect(() => {
    setSelectedPortfolio(portfolioContext.selectedPortfolio);
  }, [ portfolioContext.selectedPortfolio ]);

  /**
   * Effect for loading funds when selected portfolio is changed
   */
  React.useEffect(() => {
    loadMyFunds();
  }, [ selectedPortfolio ]);

  /**
   * Renders fund list
   */
  const renderFundList = () => (
    portfolioFunds.map(portfolioFund => {
      const foundFund = funds.find(fund => fund.id === portfolioFund.id);

      if (!foundFund) {
        return null;
      }

      return (
        <PortfolioFundCard
          fund={ foundFund }
        />
      );
    })
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

    return (
      <View>
        <View>
          <Text>
            { strings.portfolio.portfolioFunds.title }
          </Text>
        </View>
        { renderFundList() }
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

export default MyFundsScreen;