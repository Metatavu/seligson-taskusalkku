/* eslint-disable object-shorthand */
import React from "react";
import Api from "../../api/api";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { Company } from "../../generated/client";
import TestData from "../../resources/test-data";
import { CompanyApiContextType } from "../../types";
import AuthUtils from "../../utils/auth";

/**
 * Portfolios API context initialization
 */
export const CompaniesApiContext = React.createContext<CompanyApiContextType>({
  listCompany: async () => []
});

/**
 * Companies API provider component
 *
 * @param props component properties
 */
const CompaniesApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);

  /**
   * Lists Companies with given request parameters
   *
   * @param params given request parameters
   * @returns list of companies or promise reject
   */
  const listCompany = async (): Promise<Company[]> => {
    try {
      if (!auth) {
        throw new Error("No access token");
      }

      const result = AuthUtils.isDemoUser(auth) ?
        TestData.listTestCompanies(8) :
        await Api.getCompaniesApi(auth).listCompanies();

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <CompaniesApiContext.Provider
      value={{
        listCompany
      }}
    >
      { children }
    </CompaniesApiContext.Provider>
  );
};

export default CompaniesApiProvider;