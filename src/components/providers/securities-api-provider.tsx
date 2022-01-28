/* eslint-disable object-shorthand */
import React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { FindSecurityRequest, ListSecuritiesRequest, ListSecurityHistoryValuesRequest, Security, SecurityHistoryValue } from "../../generated/client";
import { SecuritiesApiContextType } from "../../types";

const initialSecurity: Security = {
  id: "",
  fundId: "",
  name: {
    fi: "",
    sv: ""
  },
  currency: "USD"
};

/**
 * Securities API context initialization
 */
export const SecuritiesApiContext = React.createContext<SecuritiesApiContextType>({
  listSecurities: async () => [],
  findSecurity: async () => initialSecurity,
  listSecurityHistoryValues: async () => []
});

/**
 * Securities API provider component
 *
 * @param props component properties
 */
const SecuritiesApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);

  /**
   * Lists securities with given request parameters
   *
   * @param params given request parameters
   * @returns list of securities or promise reject
   */
  const listSecurities = async (params: ListSecuritiesRequest) => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return await Api.getSecuritiesApi(auth).listSecurities(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Finds security with given request parameters
   *
   * @param params request parameters
   * @returns found security or promise reject
   */
  const findSecurity = async (params: FindSecurityRequest): Promise<Security> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return await Api.getSecuritiesApi(auth).findSecurity(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Lists security history values with given request parameters
   *
   * @param params request parameters
   * @returns list of security values or promise reject
   */
  const listSecurityHistoryValues = async (params: ListSecurityHistoryValuesRequest): Promise<SecurityHistoryValue[]> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      return await Api.getSecuritiesApi(auth).listSecurityHistoryValues(params);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <SecuritiesApiContext.Provider
      value={{
        listSecurities,
        findSecurity,
        listSecurityHistoryValues
      }}
    >
      { children }
    </SecuritiesApiContext.Provider>
  );
};

export default SecuritiesApiProvider;