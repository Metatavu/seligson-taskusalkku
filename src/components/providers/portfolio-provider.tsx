/* eslint-disable object-shorthand */
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { Company, Portfolio, SecurityHistoryValue } from "../../generated/client";
import strings from "../../localization/strings";
import { StatisticsLoaderParams, PortfolioContextType } from "../../types";
import ChartUtils from "../../utils/chart";
import DateUtils from "../../utils/date-utils";
import { ErrorContext } from "../error-handler/error-handler";
import { PortfoliosApiContext } from "./portfolios-api-provider";

/**
 * Portfolio context initialization
 */
export const PortfolioContext = React.createContext<PortfolioContextType>({
  portfolios: undefined,
  selectedPortfolio: undefined,
  getEffectivePortfolios: () => [],
  setStatisticsLoaderParams: () => {},
  statisticsLoaderParams: undefined,
  saveHistoryValues: () => {},
  savedHistoryValues: [],
  getCompanyPortfolios: () => [],
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
  const [ historyValues, setHistoryValues ] = React.useState<SecurityHistoryValue[]>([]);
  const [ statisticsLoaderParams, setStatisticsLoaderParams ] = React.useState<StatisticsLoaderParams>();
  const historyLoader = useRef<NodeJS.Timeout>();

  /**
   * Returns effective portfolios
   */
  const getEffectivePortfolios = (company: Company | undefined) => (
    portfolios?.filter(portfolio => (!company?.id || portfolio.companyId === company.id) && (!selectedPortfolio || portfolio.id === selectedPortfolio.id)) || []
  );

  /**
   * Returns company portfolios
   */
  const getCompanyPortfolios = (company: Company | undefined) => (
    portfolios?.filter(portfolio => (!company?.id || portfolio.companyId === company.id)) || []
  );

  /**
   * Lists portfolios
   */
  const fetchPortfolios = async () => {
    try {
      setPortfolios(undefined);
      const loadedPortfolios = await portfoliosApiContext.listPortfolios({});
      setPortfolios(loadedPortfolios);
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }
  };

  /**
   * Sets the history loader
   */
  const setHistoryLoader = () => {
    historyLoader.current = setInterval(async () => {
      try {
        if (!statisticsLoaderParams) {
          return;
        }

        const { effectivePortfolios, range } = statisticsLoaderParams;
        const { startDate, endDate } = DateUtils.getDateFilters(range);
        const portfolioHistoryValues = await Promise.all(effectivePortfolios.map(portfolio => (
          portfoliosApiContext.listPortfolioHistoryValues({
            portfolioId: portfolio.id!,
            startDate: startDate,
            endDate: endDate
          })
        )));

        setHistoryValues(ChartUtils.getAggregatedHistoryValues(portfolioHistoryValues));
      } catch (error) {
        errorContext.setError(strings.errorHandling.fundHistory.list, error);
      }
    }, 10000);
  };

  /**
   * Sets loaders
   */
  useEffect(() => {
    historyLoader.current && clearInterval(historyLoader.current);
    setHistoryLoader();

    return () => historyLoader.current && clearInterval(historyLoader.current);
  }, []);

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
    if (portfolio?.id !== selectedPortfolio?.id || !portfolio) {
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
        setStatisticsLoaderParams: setStatisticsLoaderParams,
        savedHistoryValues: historyValues,
        saveHistoryValues: setHistoryValues,
        statisticsLoaderParams: statisticsLoaderParams,
        getCompanyPortfolios,
        onChange
      }}
    >
      { children }
    </PortfolioContext.Provider>
  );
};

export default PortfolioProvider;