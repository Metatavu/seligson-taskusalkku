/* eslint-disable object-shorthand */
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { Company, Portfolio } from "../../generated/client";
import strings from "../../localization/strings";
import { PortfolioContextType } from "../../types";
import { ErrorContext } from "../error-handler/error-handler";
import { PortfoliosApiContext } from "./portfolios-api-provider";

/**
 * Portfolio context initialization
 */
export const PortfolioContext = React.createContext<PortfolioContextType>({
  portfolios: undefined,
  selectedPortfolio: undefined,
  getEffectivePortfolios: () => [],
  onChange: async () => {}
});

/**
 * Portfolio provider component
 *
 * @param props component properties
 */
const PortfolioProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const errorContext = React.useContext(ErrorContext);
  const [ portfolios, setPortfolios ] = React.useState<Portfolio[]>();
  const [ selectedPortfolio, setSelectedPortfolio ] = React.useState<Portfolio>();
  const [ loggedIn, setLoggedIn ] = React.useState(false);

  /**
   * Returns effective portfolios
   */
  const getEffectivePortfolios = (company: Company | undefined) => (
    portfolios?.filter(portfolio => (!company?.id || portfolio.companyId === company.id) && (!selectedPortfolio || portfolio.id === selectedPortfolio.id))
  );

  /**
   * Lists portfolios
   */
  const fetchPortfolios = async () => {
    try {
      setPortfolios(undefined);
      const loadedPortfolios = await portfoliosApiContext.listPortfolios();
      setPortfolios(loadedPortfolios);
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }
  };

  /**
   * Effect for fetching portfolios when loggedIn changes
   */
  React.useEffect(() => {
    loggedIn && fetchPortfolios();
  }, [ loggedIn ]);

  /**
   * Effect for setting logged in value when auth changes
   */
  React.useEffect(() => {
    auth ? !loggedIn && setLoggedIn(true) : loggedIn && setLoggedIn(false);
  }, [ auth ]);

  /**
   * Effect for removing portfolios when auth is removed
   */
  React.useEffect(() => {
    if (auth) return;
    setSelectedPortfolio(undefined);
    setPortfolios(undefined);
  }, [ auth ]);

  /**
   * Event handler for on change selected portfolio
   *
   * @param portfolio selected portfolio
   */
  const onChange = (portfolio: Portfolio | undefined) => {
    if (portfolio?.id !== selectedPortfolio?.id) {
      setSelectedPortfolio(portfolio);
    }
  };

  /**
   * Component render
   */
  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        getEffectivePortfolios,
        onChange
      }}
    >
      { children }
    </PortfolioContext.Provider>
  );
};

export default PortfolioProvider;