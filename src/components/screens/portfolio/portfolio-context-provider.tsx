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
 *
 * @param props component properties
 */
const PortfolioContextProvider: React.FC = ({ children }) => {
  const [ selectedPortfolio, setSelectedPortfolio ] = React.useState<Portfolio>();

  /**
   * Event handler for on change
   *
   * @param portfolio selected portfolio
   */
  const onChange = (portfolio: Portfolio | undefined) => {
    if (portfolio?.id !== selectedPortfolio?.id) {
      setSelectedPortfolio(portfolio);
    }
  };

  /**
   * Component render
   */
  return (
    <PortfolioContext.Provider value={{ onChange, selectedPortfolio }}>
      { children }
    </PortfolioContext.Provider>
  );
};

export default PortfolioContextProvider;