/* eslint-disable object-shorthand */
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth-slice";
import { Company, CompanyAccessLevel, Portfolio } from "../../generated/client";
import strings from "../../localization/strings";
import { CompanyContextType } from "../../types";
import MySecurityUtils from "../../utils/my-securities";
import { ErrorContext } from "../error-handler/error-handler";
import { CompaniesApiContext } from "./companies-api-provider";
import { PortfolioContext } from "./portfolio-provider";

/*
 * Portfolio context initialization
 */
export const CompanyContext = React.createContext<CompanyContextType>({
  companies: [],
  selectedCompany: undefined,
  onChange: () => {}
});

/**
 * Portfolio provider component
 *
 * @param props component properties
 */
const CompanyProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectAuth);
  const portfolioContext = React.useContext(PortfolioContext);
  const { listCompany } = React.useContext(CompaniesApiContext);
  const errorContext = React.useContext(ErrorContext);
  const [ companies, setCompanies ] = React.useState<Company[]>();
  const [ selectedCompany, setSelectedCompany ] = React.useState<Portfolio>();
  const [ loggedIn, setLoggedIn ] = React.useState(false);

  /**
   * Lists portfolios
   */
  const fetchCompany = async () => {
    const companyIds = MySecurityUtils.getCompanyIds(portfolioContext.portfolios || []);
    if (!companyIds.length) return;

    try {
      setSelectedCompany(undefined);
      const loadedCompanies = await listCompany(companyIds);
      setCompanies(loadedCompanies);
      setSelectedCompany(loadedCompanies.find(company => company.accessLevel === CompanyAccessLevel.Owned) || loadedCompanies[0]);
    } catch (error) {
      errorContext.setError(strings.errorHandling.company.list, error);
    }
  };

  /**
   * Effect for fetching portfolios when loggedIn changes
   */
  React.useEffect(() => {
    loggedIn && fetchCompany();
  }, [ loggedIn, portfolioContext.portfolios ]);

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
    setSelectedCompany(undefined);
    setCompanies(undefined);
  }, [ auth ]);

  /**
   * Event handler for on change selected portfolio
   *
   * @param company selected company
   */
  const onChange = (company: Company) => {
    if (company?.id !== selectedCompany?.id) {
      setSelectedCompany(company);
      const effectivePortfolios = portfolioContext.portfolios?.filter(portfolio => portfolio.companyId === company.id) || [];
      effectivePortfolios.length === 1 ? portfolioContext.onChange(effectivePortfolios[0]) : portfolioContext.onChange(undefined);
    }
  };

  /**
   * Component render
   */
  return (
    <CompanyContext.Provider
      value={{
        companies,
        selectedCompany,
        onChange
      }}
    >
      { children }
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;