/* eslint-disable object-shorthand */
import * as React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { GetPortfolioHSummaryRequest, ListPortfolioHistoryValuesRequest, Portfolio, PortfolioSummary } from "../../generated/client";
import TestData from "../../resources/test-data";
import { ChartRange, PortfoliosApiContextType } from "../../types";
import AuthUtils from "../../utils/auth";

const initialSummary: PortfolioSummary = { redemptions: 0, subscriptions: 0 };

/**
 * Portfolios api context initialization
 */
export const PortfoliosApiContext = React.createContext<PortfoliosApiContextType>({
  listPortfolios: async () => [],
  listPortfolioHistoryValues: async () => [],
  getPortfolioHSummary: async () => (initialSummary)
});

/**
 * Portfolios API provider component
 *
 * @param props component properties
 */
const PortfoliosApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);

  /**
   * Lists portfolios with given request parameters
   *
   * @param params given request parameters
   * @returns list of portfolios or promise reject
   */
  const listPortfolios = async (): Promise<Portfolio[]> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return AuthUtils.isDemoUser(auth) ?
        TestData.getTestPortfolio(8) :
        await Api.getPortfoliosApi(auth).listPortfolios();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Lists portfolio history values with given request parameters
   *
   * @param params request parameters
   * @param range chart range (used for generating test data)
   * @returns list of portfolio history values or promise reject
   */
  const listPortfolioHistoryValues = async (params: ListPortfolioHistoryValuesRequest, range?: ChartRange) => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return AuthUtils.isDemoUser(auth) ?
        TestData.getTestHistoricalValues(range) :
        await Api.getPortfoliosApi(auth).listPortfolioHistoryValues(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Gets portfolio summary with given request parameters
   *
   * @param params request parameters
   * @returns portfolio summary or promise reject
   */
  const getPortfolioHSummary = async (params: GetPortfolioHSummaryRequest): Promise<PortfolioSummary> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return AuthUtils.isDemoUser(auth) ?
        TestData.getTestPortfolioSummary() :
        await Api.getPortfoliosApi(auth).getPortfolioHSummary(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <PortfoliosApiContext.Provider
      value={{
        listPortfolios,
        listPortfolioHistoryValues,
        getPortfolioHSummary
      }}
    >
      { children }
    </PortfoliosApiContext.Provider>
  );
};

export default PortfoliosApiProvider;