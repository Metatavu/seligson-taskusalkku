import moment from "moment";
import { Fund, FundGroup, HistoricalValue, Portfolio, PortfolioFund, PortfolioSummary } from "../generated/client";
import { ChartRange } from "../types";

/**
 * Customer namespace for test data
 */
namespace TestData {

  /**
   * Generates fund
   *
   * @param id fund id
   * @returns generated fund
   */
  const generateFund = (id: string) => ({
    id: id,
    name: {
      fi: "USA Markkina",
      sv: "USA Markkina"
    },
    longName: {
      fi: "USA Markkina",
      sv: "USA Markkina"
    },
    shortName: {
      fi: "USA Markkina",
      sv: "USA Markkina"
    },
    bankReceiverName: "Nordea",
    group: FundGroup.Passive,
    priceDate: new Date("2021-01-01"),
    aShareValue: 18.947,
    bShareValue: 0,
    changeData: {
      change1d: 1,
      change1m: 2,
      change1y: 3,
      change3y: 4,
      change5y: 5,
      change10y: 6,
      change15y: 7,
      change20y: 8
    },
    profitProjection: 10,
    profitProjectionDate: new Date("2021-01-01"),
    color: "#0077b3",
    risk: 6,
    kIID: {
      fi: "",
      sv: ""
    }
  });

  /**
   * Test data for the fund card component
   */
  export const getTestFunds = (amount: number): Fund[] => {
    const funds: Fund[] = [];

    for (let i = 0; i < amount; i++) {
      funds.push(generateFund(i.toString()));
    }

    return funds;
  };

  /**
   * Generates random number list with given parameters
   *
   * @param length length of the created list
   * @param min min value
   * @param max max value
   * @param multiplier multiplier
   * @returns list of generated numbers
   */
  export const randomNumberList = (length: number, min: number = 1, max: number = 100, multiplier: number = 1) => {
    return [ ...Array(length).keys() ].map((_, i) => Math.floor((Math.random() * (max - min) + min) + i * multiplier));
  };

  /**
   * Gets amount to generate values based on chart range value
   *
   * @param range chart range
   * @returns amount
   */
  const getAmount = (dateRange: ChartRange): number => ({
    [ChartRange.MONTH]: 30,
    [ChartRange.YEAR]: 365,
    [ChartRange.THREE_YEARS]: (3 * 365),
    [ChartRange.FIVE_YEARS]: (5 * 365),
    [ChartRange.TEN_YEARS]: (10 * 365),
    [ChartRange.MAX]: (20 * 365)
  })[dateRange];

  /**
   * Gets test data for historical values
   *
   * @param amount of values to generate
   * @returns list of generate HistoricalValue objects
   */
  export const getTestHistoricalValues = (range?: ChartRange): HistoricalValue[] => {
    const amount = range ? getAmount(range) : 365;

    return TestData.randomNumberList(amount, 1, 10, 0.5).map((value, i) => ({
      date: moment().subtract(amount - i, "days").toDate(),
      value: value
    }));
  };

  /**
   * Gets test data for historical values
   *
   * @param amount of values to generate
   * @returns list of generate HistoricalValue objects
   */
  export const getTestPortfolio = (amount: number): Portfolio[] => {
    const portfolios: Portfolio[] = [];

    for (let i = 0; i < amount; i++) {
      portfolios.push({
        id: i.toString(),
        marketValueTotal: Math.floor((Math.random() * 1000)),
        purchaseTotal: Math.floor((Math.random() * 1000)),
        totalAmount: Math.floor((Math.random() * 10000))
      });
    }

    return portfolios;
  };

  /**
   * Gets test data for portfolio summary
   *
   * @returns random portfolio summary
   */
  export const getTestPortfolioSummary = (): PortfolioSummary => ({
    redemptions: Math.floor((Math.random() * 10000)),
    subscriptions: Math.floor((Math.random() * 10000))
  });

  /**
   * Test data for the portfolio funds
   *
   * @param amount amount of portfolio funds to generate
   * @returns list of generated portfolio funds
   */
  export const getTestPortfolioFunds = (amount: number): PortfolioFund[] => {
    const portfolioFunds: PortfolioFund[] = [];

    for (let i = 0; i < amount; i++) {
      portfolioFunds.push({
        id: i.toString(),
        amount: Math.random() * 100,
        purchaseValue: Math.random() * 10000,
        totalValue: Math.random() * 10000
      });
    }

    return portfolioFunds;
  };

}

export default TestData;