/* eslint-disable object-shorthand */
import * as React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { ListPortfolioFundsRequest } from "../../generated/client";
import TestData from "../../resources/test-data";
import { PortfolioFundsApiContextType } from "../../types";
import AuthUtils from "../../utils/auth";

/**
 * Portfolio funds API context initialization
 */
export const PortfolioFundsApiContext = React.createContext<PortfolioFundsApiContextType>({
  listPortfolioFunds: async () => []
});

/**
 * Portfolio funds API provider component
 */
const PortfolioFundsApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);

  /**
   * Lists funds with given request parameters
   *
   * @param params given request parameters
   * @returns list of funds or promise reject
   */
  const listPortfolioFunds = async (params: ListPortfolioFundsRequest) => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return AuthUtils.isDemoUser(auth) ?
        TestData.getTestPortfolioFunds(20) :
        await Api.getPortfoliosApi(auth).listPortfolioFunds(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <PortfolioFundsApiContext.Provider value={{ listPortfolioFunds }}>
      { children }
    </PortfolioFundsApiContext.Provider>
  );
};

export default PortfolioFundsApiProvider;