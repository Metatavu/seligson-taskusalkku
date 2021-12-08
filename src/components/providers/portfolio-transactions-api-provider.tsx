/* eslint-disable object-shorthand */
import * as React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { FindPortfolioTransactionsRequest, PortfolioTransaction, ListPortfolioTransactionsRequest, TransactionType } from "../../generated/client";
import TestData from "../../resources/test-data";
import { PortfolioTransactionsApiContextType } from "../../types";
import AuthUtils from "../../utils/auth";

const initialPortfolioTransaction: PortfolioTransaction = {
  fundId: "",
  marketValue: 0,
  paymentDate: new Date(),
  provision: 0,
  shareAmount: 0,
  totalValue: 0,
  type: TransactionType.Redemption,
  value: 0,
  valueDate: new Date()
};

/**
 * PortfolioTransactions API context initialization
 */
export const PortfolioTransactionsApiContext = React.createContext<PortfolioTransactionsApiContextType>({
  listPortfolioTransactions: async () => [],
  findPortfolioTransactions: async () => initialPortfolioTransaction
});

/**
 * PortfolioTransactions API provider component
 *
 * @param props component properties
 */
const PortfolioTransactionsApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);

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
        TestData.getTestPortfolioTransactions(20) :
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
  const findPortfolioTransactions = async (params: FindPortfolioTransactionsRequest): Promise<PortfolioTransaction> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      if (AuthUtils.isDemoUser(auth)) {
        const testPortfolioTransaction = TestData.getTestPortfolioTransactions(20)
          .find(portfoliotransaction => portfoliotransaction.id === params.transactionId);

        if (testPortfolioTransaction) {
          return testPortfolioTransaction;
        }
      }

      return await Api.getPortfoliosApi(auth).findPortfolioTransactions(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <PortfolioTransactionsApiContext.Provider
      value={{
        listPortfolioTransactions,
        findPortfolioTransactions
      }}
    >
      { children }
    </PortfolioTransactionsApiContext.Provider>
  );
};

export default PortfolioTransactionsApiProvider;