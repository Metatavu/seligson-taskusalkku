/* eslint-disable object-shorthand */
import React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { FindSecurityRequest, ListSecuritiesRequest, Security } from "../../generated/client";
import TestData from "../../resources/test-data";
import { SecuritiesApiContextType } from "../../types";
import AuthUtils from "../../utils/auth";

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
  findSecurity: async () => initialSecurity
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

      return AuthUtils.isDemoUser(auth) ?
        TestData.listTestSecurities(20) :
        await Api.getSecuritiesApi(auth).listSecurities(params);
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
   * Component render
   */
  return (
    <SecuritiesApiContext.Provider value={{ listSecurities, findSecurity }}>
      { children }
    </SecuritiesApiContext.Provider>
  );
};

export default SecuritiesApiProvider;