/* eslint-disable object-shorthand */
import * as React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAnonymousAuth, selectAuth } from "../../features/auth/auth-slice";
import { FindFundRequest, Fund, HistoricalValue, ListFundsRequest, ListHistoricalValuesRequest } from "../../generated/client";
import { FundsApiContextType } from "../../types";

const initialFund: Fund = { name: { fi: "", sv: "" } };

/**
 * Funds API context initialization
 */
export const FundsApiContext = React.createContext<FundsApiContextType>({
  listFunds: async () => [],
  findFund: async () => initialFund,
  listHistoricalValues: async () => []
});

/**
 * Funds API provider component
 *
 * @param props component properties
 */
const FundsApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);
  const anonymousAuth = useAppSelector(selectAnonymousAuth);

  /**
   * Lists funds with given request parameters
   *
   * @param params given request parameters
   * @returns list of funds or promise reject
   */
  const listFunds = async (params: ListFundsRequest): Promise<Fund[]> => {
    try {
      if (!anonymousAuth) {
        throw new Error("No access token");
      }

      return await Api.getFundsApi(auth || anonymousAuth).listFunds(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Finds fund with given request parameters
   *
   * @param params request parameters
   * @returns found fund or promise reject
   */
  const findFund = async (params: FindFundRequest): Promise<Fund> => {
    try {
      if (!anonymousAuth) {
        throw new Error("No access token");
      }

      return await Api.getFundsApi(auth || anonymousAuth).findFund(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Lists fund historical values with given request parameters
   *
   * @param params request parameters
   * @param range chart range
   * @returns list of fund historical values or promise reject
   */
  const listHistoricalValues = async (params: ListHistoricalValuesRequest): Promise<HistoricalValue[]> => {
    try {
      if (!anonymousAuth) {
        throw new Error("No access token");
      }

      return await Api.getFundsApi(auth || anonymousAuth).listHistoricalValues(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <FundsApiContext.Provider
      value={{
        listFunds,
        findFund,
        listHistoricalValues
      }}
    >
      { children }
    </FundsApiContext.Provider>
  );
};

export default FundsApiProvider;