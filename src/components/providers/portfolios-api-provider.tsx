/* eslint-disable object-shorthand */
import React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { FindPortfolioTransactionRequest, GetPortfolioSummaryRequest, ListPortfolioHistoryValuesRequest, ListPortfolioSecuritiesRequest, ListPortfolioTransactionsRequest, Portfolio, PortfolioSummary, PortfolioTransaction, TransactionType } from "../../generated/client";
import TestData from "../../resources/test-data";
import { ChartRange, PortfoliosApiContextType } from "../../types";
import AuthUtils from "../../utils/auth";

const initialPortfolioSummary: PortfolioSummary = {
  redemptions: "0",
  subscriptions: "0"
};

const initialPortfolioTransaction: PortfolioTransaction = {
  securityId: "",
  marketValue: "0",
  paymentDate: new Date(),
  provision: "0",
  shareAmount: "0",
  totalValue: "0",
  transactionType: TransactionType.Redemption,
  value: "0",
  valueDate: new Date()
};

/**
 * Portfolios API context initialization
 */
export const PortfoliosApiContext = React.createContext<PortfoliosApiContextType>({
  listPortfolios: async () => [],
  getPortfolioSummary: async () => initialPortfolioSummary,
  listPortfolioHistoryValues: async () => [],
  listPortfolioSecurities: async () => [],
  listPortfolioTransactions: async () => [],
  findPortfolioTransaction: async () => initialPortfolioTransaction
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
        TestData.listTestPortfolios(8) :
        await Api.getPortfoliosApi(auth).listPortfolios();
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
  const getPortfolioSummary = async (params: GetPortfolioSummaryRequest): Promise<PortfolioSummary> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return AuthUtils.isDemoUser(auth) ?
        TestData.getTestPortfolioSummary() :
        await Api.getPortfoliosApi(auth).getPortfolioSummary(params);
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
        TestData.listTestPortfolioHistoryValues(range) :
        await Api.getPortfoliosApi(auth).listPortfolioHistoryValues(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Lists portfolio securities with given request parameters
   *
   * @param params given request parameters
   * @returns list of portfolio securities or promise reject
   */
  const listPortfolioSecurities = async (params: ListPortfolioSecuritiesRequest) => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return AuthUtils.isDemoUser(auth) ?
        TestData.listTestPortfolioSecurities(20) :
        await Api.getPortfoliosApi(auth).listPortfolioSecurities(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Lists portfolio transactions with given request parameters
   *
   * @param params given request parameters
   * @returns list of portfolio transactions or promise reject
   */
  const listPortfolioTransactions = async (params: ListPortfolioTransactionsRequest): Promise<PortfolioTransaction[]> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return AuthUtils.isDemoUser(auth) ?
        TestData.listTestPortfolioTransactions(20) :
        await Api.getPortfoliosApi(auth).listPortfolioTransactions(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Finds portfolio transaction with given request parameters
   *
   * @param params request parameters
   * @returns found portfolio transaction or promise reject
   */
  const findPortfolioTransaction = async (params: FindPortfolioTransactionRequest): Promise<PortfolioTransaction> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      if (AuthUtils.isDemoUser(auth)) {
        const testPortfolioTransaction = TestData
          .listTestPortfolioTransactions(20)
          .find(({ id }) => id === params.transactionId);

        if (!testPortfolioTransaction) {
          throw new Error("Transaction not found");
        }

        return testPortfolioTransaction;
      }

      return await Api.getPortfoliosApi(auth).findPortfolioTransaction(params);
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
        getPortfolioSummary,
        listPortfolioHistoryValues,
        listPortfolioSecurities,
        listPortfolioTransactions,
        findPortfolioTransaction
      }}
    >
      { children }
    </PortfoliosApiContext.Provider>
  );
};

export default PortfoliosApiProvider;