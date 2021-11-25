import { Portfolio, PortfolioSummary } from "../generated/client";

/**
 * Custom namespace for calculations
 */
namespace Calculations {

  /**
   * Gets current total change amount
   *
   * @param purchaseValue purchase value
   * @param totalValue total value
   * @returns calculated amount
   */
  export const getTotalChangeAmount = (purchaseValue?: number, totalValue?: number): number => {
    if (!purchaseValue || !totalValue) {
      return 0;
    }

    return totalValue - purchaseValue;
  };
  
  /**
   * Gets current total change in percentages
   *
   * @param purchaseValue purchase value
   * @param totalValue total value
   * @returns calculated percentage
   */
  export const getTotalChangePercentage = (purchaseValue?: number, totalValue?: number): string => {
    if (!purchaseValue || !totalValue) {
      return "0";
    }

    return (((totalValue * 100) / purchaseValue) - 100).toFixed(2);
  };

  /**
   * Calculates totals for list of portfolios
   *
   * @param portfolios list of portfolios
   * @returns array that contains calculated totals for market value and purchase value
   */
  const calculateTotals = (portfolios: Portfolio[]) => {
    return portfolios.reduce<[ number, number ]>(
      ([ marketSum, purchaseSum ], { marketValueTotal, purchaseTotal }) => [ marketSum + (marketValueTotal || 0), purchaseSum + (purchaseTotal || 0) ],
      [ 0, 0 ]
    );
  };

  /**
   * Calculates portfolio total change
   *
   * @param portfolios list of portfolios
   * @returns calculated total change
   */
  const calculatePortfoliosTotalChange = (portfolios: Portfolio[]): number => {
    return portfolios.reduce((total, { purchaseTotal, totalAmount }) => total + getTotalChangeAmount(purchaseTotal, totalAmount), 0);
  };

  /**
   * Calculates portfolio total change in percentages
   *
   * @param portfolios list of portfolios
   * @returns calculated total change in percentages for list of portfolios
   */
  const calculatePortfoliosTotalChangePercentage = (portfolios: Portfolio[]): string => {
    const [ totalPurchaseValue, currentTotalValue ] = portfolios.reduce<[ number, number ]>(
      ([ purchaseSum, totalSum ], { purchaseTotal, totalAmount }) => [ purchaseSum + (purchaseTotal || 0), totalSum + (totalAmount || 0) ],
      [ 0, 0 ]
    );

    return getTotalChangePercentage(totalPurchaseValue, currentTotalValue);
  };

  /**
   * Gets value information for list of portfolios
   *
   * @param portfolios list of portfolios
   * @returns object that contains market value total, purchase total, total change (in cents) and total change percentage
   */
  export const getTotalPortfolioInfo = (portfolios: Portfolio[]) => {
    const [ marketValueTotal, purchaseTotal ] = calculateTotals(portfolios);
    return {
      marketValueTotal: marketValueTotal,
      purchaseTotal: purchaseTotal,
      totalChangeAmount: calculatePortfoliosTotalChange(portfolios),
      totalChangePercentage: calculatePortfoliosTotalChangePercentage(portfolios)
    };
  };

  /**
   * Gets summary info for list of portfolios
   *
   * @param summaries list of summaries
   * @returns array that contains sum of subscriptions and redemptions
   */
  export const getPortfolioSummaryInfo = (summaries: PortfolioSummary[]) => {
    return summaries.reduce<[ number, number ]>(
      ([ subscriptionsSum, redemptionsSum ], { subscriptions, redemptions }) =>
        [ subscriptionsSum + (subscriptions || 0), redemptionsSum + (redemptions || 0) ],
      [ 0, 0 ]
    );
  };

}

export default Calculations;