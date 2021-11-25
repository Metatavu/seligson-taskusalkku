/* eslint-disable object-shorthand */
import * as React from "react";
import { Portfolio } from "../../../generated/client";
import { PortfolioContextType } from "../../../types";

/**
 * Portfolio context initialization
 */
export const PortfolioContext = React.createContext<PortfolioContextType>({
  selectedPortfolio: undefined,
  onChange: async () => {}
});

/**
 * Component for portfolio context provider
 */
const PortfolioContextProvider: React.FC = ({ children }) => {
  const [ selectedPortfolio, setSelectedPortfolio ] = React.useState<Portfolio>();

  /**
   * Event handler for on change
   */
  const onChange = (portfolio: Portfolio | undefined) => {
    if (portfolio?.id !== selectedPortfolio?.id) {
      setSelectedPortfolio(portfolio);
    }
  };

  return (
    <PortfolioContext.Provider value={{ onChange, selectedPortfolio }}>
      { children }
    </PortfolioContext.Provider>
  );
};

export default PortfolioContextProvider;