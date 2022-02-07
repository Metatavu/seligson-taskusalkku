import BigNumber from "bignumber.js";
import { Portfolio, PortfolioSummary } from "../generated/client";

/**
 * Custom namespace for calculations
 */
namespace Calculations {

  /**
   * Check is a number zero
   * 
   * @param number number
   * @return is the number zero
   */
  const isZero = (number: string): boolean => (
    (new BigNumber(number)).isEqualTo(0)
  );

  /**
   * Gets current total change amount
   *
   * @param purchaseValue purchase value
   * @param totalValue total value
   * @returns calculated amount
   */
  export const getTotalChangeAmount = (purchaseValue?: string, totalValue?: string): string => {
    if (!purchaseValue || !totalValue) {
      return "0";
    }

    return new BigNumber(totalValue).minus(purchaseValue).toString();
  };

  /**
   * Gets current total change in percentages
   *
   * @param purchaseValue purchase value
   * @param totalValue total value
   * @returns calculated percentage
   */
  export const getTotalChangePercentage = (purchaseValue?: string, totalValue?: string): string => {
    if (!purchaseValue || !totalValue || isZero(purchaseValue)) {
      return "0";
    }

    return new BigNumber(totalValue)
      .multipliedBy(100)
      .dividedBy(purchaseValue)
      .minus(100)
      .toFormat(2);
  };

  /**
   * Calculates totals for list of portfolios
   *
   * @param portfolios list of portfolios
   * @returns array that contains calculated totals for market value and purchase value
   */
  const calculateTotals = (portfolios: Portfolio[]) => {
    return portfolios.reduce<[ string, string ]>(
      ([ marketSum, purchaseSum ], { marketValueTotal, purchaseTotal }) => [
        new BigNumber(marketSum).plus(marketValueTotal || 0).toString(),
        new BigNumber(purchaseSum).plus(purchaseTotal || 0).toString()
      ],
      [ "0", "0" ]
    );
  };

  /**
   * Calculates portfolio total change
   *
   * @param portfolios list of portfolios
   * @returns calculated total change
   */
  const calculatePortfoliosTotalChange = (portfolios: Portfolio[]): string => {
    return portfolios.reduce((total, { purchaseTotal, marketValueTotal }) => (
      new BigNumber(total).plus(getTotalChangeAmount(purchaseTotal, marketValueTotal)).toString()
    ), "0");
  };

  /**
   * Calculates portfolio total change in percentages
   *
   * @param portfolios list of portfolios
   * @returns calculated total change in percentages for list of portfolios
   */
  const calculatePortfoliosTotalChangePercentage = (portfolios: Portfolio[]): string => {
    const [ totalPurchaseValue, currentTotalValue ] = portfolios.reduce<[ string, string ]>(
      ([ purchaseSum, totalSum ], { purchaseTotal, marketValueTotal }) => [
        new BigNumber(purchaseSum).plus(purchaseTotal || 0).toString(),
        new BigNumber(totalSum).plus(marketValueTotal || 0).toString()
      ],
      [ "0", "0" ]
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
    const totalChange = calculatePortfoliosTotalChange(portfolios);
    const totalChangePercentage = calculatePortfoliosTotalChangePercentage(portfolios);

    return {
      marketValueTotal: Calculations.formatEuroNumberStr(marketValueTotal),
      purchaseTotal: Calculations.formatEuroNumberStr(purchaseTotal),
      totalChangeAmount: Calculations.formatEuroNumberStr(totalChange),
      totalChangePercentage: Calculations.formatEuroNumberStr(totalChangePercentage)
    };
  };

  /**
   * Gets summary info for list of portfolios
   *
   * @param summaries list of summaries
   * @returns object that contains sum of subscriptions and redemptions
   */
  export const getPortfolioSummaryInfo = (summaries: PortfolioSummary[]): { subscriptionsTotal: string, redemptionsTotal: string } => {
    let subscriptionsTotal: string = "0";
    let redemptionsTotal: string = "0";

    summaries.forEach(summary => {
      subscriptionsTotal = new BigNumber(subscriptionsTotal).plus(summary.subscriptions).toString();
      redemptionsTotal = new BigNumber(redemptionsTotal).plus(summary.redemptions).toString();
    });

    return {
      subscriptionsTotal: Calculations.formatEuroNumberStr(subscriptionsTotal),
      redemptionsTotal: Calculations.formatEuroNumberStr(redemptionsTotal)
    };
  };

  /**
   * Formats number string according to given rules
   *
   * @param numberStr number as string or instance of BigNumber
   * @param decimalPlaces number of decimal places
   * @param format format settings
   */
  export const formatNumberStr = (number: string | BigNumber, decimalPlaces: number, format?: BigNumber.Format) => (
    new BigNumber(number).toFormat(decimalPlaces, {
      groupSize: 3,
      groupSeparator: " ",
      decimalSeparator: ",",
      ...format
    })
  );

  /**
   * Formats euro number string
   * 
   * @param number number to be formatted
   * @param decimalPlaces number of decimal places, default to 2
   */
  export const formatEuroNumberStr = (number: string | BigNumber, decimalPlaces: number = 2) => (
    Calculations.formatNumberStr(number, decimalPlaces, { suffix: " €" })
  );

  /**
   * Formats percentage number string
   * 
   * @param number number to be formatted
   * @param decimalPlaces number of decimal places, default to 2
   */
  export const formatPercentageNumberStr = (number: string | BigNumber, decimalPlaces: number = 2) => (
    Calculations.formatNumberStr(number, decimalPlaces, { suffix: " %" })
  );

  /**
   * Aggregates any list and skips list values according to skipValue
   *
   * @param list any list
   * @param skipValue how many values should be skip on every iteration
   * @returns aggregated list
   */
  export const aggregateList = <T>(list: T[], skipValue: number = 10): T[] => {
    const compressedList: T[] = [];
    const { length } = list;

    if (!length) {
      return compressedList;
    }

    for (let i = 0; i < length - 1; i += skipValue) {
      compressedList.push(list[i]);
    }

    compressedList.push(list[length - 1]);

    return compressedList;
  };

}

export default Calculations;