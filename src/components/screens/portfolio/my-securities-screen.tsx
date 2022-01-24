import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Headline } from "react-native-paper";
import { Fund, PortfolioSecurity, Security } from "../../../generated/client";
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
  portfolioId: string;
  portfolioSecurity: PortfolioSecurity;
  security: Security;
  fund: Fund;
}

/**
 * My securities screen component
 */
const MySecuritiesScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);
  const { portfolios, selectedPortfolio, getEffectivePortfolios } = React.useContext(PortfolioContext);
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const securitiesApiContext = React.useContext(SecuritiesApiContext);
  const fundsApiContext = React.useContext(FundsApiContext);

  const [ loading, setLoading ] = React.useState(true);
  const [ mySecurities, setMySecurities ] = React.useState<MySecurityInfo[]>([]);

  /**
   * Loads portfolio security info
   *
   * @param portfolioId portfolio ID
   * @param uniquePortfolioSecurity unique portfolio security
   * @returns Promise of my security info
   */
  const loadPortfolioSecurityInfo = async (portfolioId: string, portfolioSecurity: PortfolioSecurity): Promise<MySecurityInfo> => {
    const security = await securitiesApiContext.findSecurity({ securityId: portfolioSecurity.id });
    const fund = await fundsApiContext.findFund({ fundId: security.fundId });

    return {
      portfolioId: portfolioId,
      portfolioSecurity: portfolioSecurity,
      security: security,
      fund: fund
    };
  };

  /**
   * Loads my securities
   */
  const loadMySecurities = async () => {
    try {
      const effectivePortfolios = getEffectivePortfolios().filter(({ id }) => !!id);

      const identifiedPortfolioSecurities = await Promise.all(
        effectivePortfolios.map(async ({ id }) => ({
          portfolioId: id!,
          portfolioSecurities: await portfoliosApiContext.listPortfolioSecurities({ portfolioId: id! })
        }))
      );

      const mySecurityPromises: Promise<MySecurityInfo>[] = [];

      identifiedPortfolioSecurities.forEach(
        ({ portfolioId, portfolioSecurities }) => portfolioSecurities.forEach(
          portfolioSecurity => mySecurityPromises.push(loadPortfolioSecurityInfo(portfolioId, portfolioSecurity))
        )
      );

      setMySecurities(await Promise.all(mySecurityPromises));
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolioSecurities.list, error);
    }

    setLoading(false);
  };

  /**
   * Effect for loading my funds when portfolio context data changes
   */
  React.useEffect(() => { loadMySecurities(); }, [ selectedPortfolio, portfolios ]);

  /**
   * Renders portfolio security card
   *
   * @param mySecurityInfo my security info
   */
  const renderPortfolioSecurityCard = (mySecurityInfo: MySecurityInfo) => (
    <PortfolioSecurityCard
      key={ `${mySecurityInfo.portfolioId}-${mySecurityInfo.portfolioSecurity.id}` }
      { ...mySecurityInfo }
    />
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
      <View style={{ padding: theme.spacing(2) }}>
        { mySecurities.map(renderPortfolioSecurityCard) }
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