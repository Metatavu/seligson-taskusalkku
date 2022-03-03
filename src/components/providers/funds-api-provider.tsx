/* eslint-disable object-shorthand */
import React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAnonymousAuth, selectAuth } from "../../features/auth/auth-slice";
import { FindFundRequest, Fund, ListFundsRequest } from "../../generated/client";
import { FundsApiContextType } from "../../types";

const initialFund: Fund = {
  longName: {
    fi: "",
    sv: "",
    en: ""
  },
  shortName: {
    fi: "",
    sv: "",
    en: ""
  }
};

/**
 * Funds API context initialization
 */
export const FundsApiContext = React.createContext<FundsApiContextType>({
  listFunds: async () => [],
  findFund: async () => initialFund
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
   * Component render
   */
  return (
    <FundsApiContext.Provider
      value={{ listFunds, findFund }}
    >
      { children }
    </FundsApiContext.Provider>
  );
};

export default FundsApiProvider;