import moment from "moment";
import { Fund, FundGroup, SecurityHistoryValue, Portfolio, PortfolioHistoryValue, PortfolioSecurity, PortfolioSummary, PortfolioTransaction, Security, TransactionType } from "../generated/client";
import { ChartRange } from "../types";

/**
 * Namespace for test data
 */
namespace TestData {

  /**
   * Returns a random value from given enumerable
   */
  const randomEnumValue = (enumeration: any) => {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
  };

  /**
   * Returns a random date
   *
   * start start date
   * end end date
   */
  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  /**
   * Returns a random color
   */
  const randomColor = () => {
    const colors = [ "olive", "blue", "orange", "pink", "gray" ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  /**
   * Returns a random name
   */
  const randomName = () => {
    const names = [ "USA Markkina", "Eurooppa", "Euro Corporate Bond", "Kehittyvät markkinat", "Kestävä Vaikuttajakorko" ];
    return names[Math.floor(Math.random() * names.length)];
  };

  /**
   * Returns a list of random numbers as strings with given parameters
   *
   * @param length length of the created list
   * @param min min value
   * @param max max value
   * @param multiplier multiplier
   * @returns list of generated numbers
   */
  export const randomNumberList = (length: number, min: number = 1, max: number = 100, multiplier: number = 1) => {
    return [ ...Array(length).keys() ].map((_, i) => Math.floor((Math.random() * (max - min) + min) + i * multiplier).toString());
  };

  /**
   * Generates transaction
   *
   * @param id fund id
   * @returns generated transaction
   */
  const generateTransaction = (id: string): PortfolioTransaction => ({
    id: id,
    securityId: id,
    marketValue: Math.floor((Math.random() * 100)).toString(),
    paymentDate: randomDate(new Date(2012, 0, 1), new Date()),
    provision: "1",
    shareAmount: Math.floor((Math.random() * 100)).toString(),
    totalValue: Math.floor((Math.random() * 100)).toString(),
    transactionType: randomEnumValue(TransactionType),
    value: Math.floor((Math.random() * 100)).toString(),
    valueDate: randomDate(new Date(2012, 0, 1), new Date())
  });

  /**
   * Generates security
   *
   * @param id security ID
   * @returns generated security
   */
  const generateSecurity = (id: string): Security => ({
    id: id,
    fundId: id,
    name: {
      fi: randomName(),
      sv: randomName()
    },
    currency: "EUR"
  });

  /**
   * Generates fund
   *
   * @param id fund ID
   * @returns generated fund
   */
  const generateFund = (id: string): Fund => ({
    id: id,
    name: {
      fi: "USA Markkina",
      sv: "USA Markkina"
    },
    longName: {
      fi: randomName(),
      sv: "USA Markkina"
    },
    shortName: {
      fi: "USA Markkina",
      sv: "USA Markkina"
    },
    bankReceiverName: "Nordea",
    group: FundGroup.Passive,
    priceDate: new Date("2021-01-01"),
    aShareValue: "18.947",
    bShareValue: "0",
    changeData: {
      change1d: "1",
      change1m: "2",
      change1y: "3",
      change3y: "4",
      change5y: "5",
      change10y: "6",
      change15y: "7",
      change20y: "8"
    },
    profitProjection: "10",
    profitProjectionDate: new Date("2021-01-01"),
    color: randomColor(),
    risk: 6,
    kIID: {
      fi: "",
      sv: ""
    }
  });

  /**
   * Lists test securities
   *
   * @param amount amount of securities to generate
   */
  export const listTestSecurities = (amount: number) => {
    return Array.from({ length: amount }, (_, i) => generateSecurity(i.toString()));
  };

  /**
   * Lists test portfolio transactions
   *
   * @param amount amount of portfolio transactions to generate
   */
  export const listTestPortfolioTransactions = (amount: number): PortfolioTransaction[] => {
    return Array.from({ length: amount }, (_, i) => generateTransaction(i.toString()));
  };

  /**
   * Lists test funds
   *
   * @param amount amount of funds to generate
   */
  export const listTestFunds = (amount: number): Fund[] => {
    return Array.from({ length: amount }, (_, i) => generateFund(i.toString()));
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
   * Lists test security history values
   *
   * @param range range to generate fund history values for
   * @returns list of generated security history values
   */
  export const listTestSecurityHistoryValues = (range?: ChartRange): SecurityHistoryValue[] => {
    const amount = range ? getAmount(range) : 365;

    return TestData.randomNumberList(amount, 1, 100, 0.1).map((value, i) => ({
      date: moment().subtract(amount - i, "days").toDate(),
      value: value
    }));
  };

  /**
   * Lists test portfolios
   *
   * @param amount amount of portfolios to generate
   */
  export const listTestPortfolios = (amount: number): Portfolio[] => {
    return [ ...Array(amount).keys() ].map((_, i) => ({
      id: i.toString(),
      name: `${i}`,
      marketValueTotal: Math.floor((Math.random() * 1000)).toString(),
      purchaseTotal: Math.floor((Math.random() * 1000)).toString(),
      totalAmount: Math.floor((Math.random() * 10000)).toString()
    }));
  };

  /**
   * Gets test portfolio summary
   */
  export const getTestPortfolioSummary = (): PortfolioSummary => ({
    redemptions: Math.floor((Math.random() * 10000)).toString(),
    subscriptions: Math.floor((Math.random() * 10000)).toString()
  });

  /**
   * Lists test portfolio history values
   *
   * @param range range to generate portfolio history values for
   */
  export const listTestPortfolioHistoryValues = (range?: Date[] | ChartRange): PortfolioHistoryValue[] => {
    if (Array.isArray(range)) {
      return [];
    }

    const amount = range ? getAmount(range) : 365;

    return TestData.randomNumberList(amount, 1, 10, 0.5).map((value, i) => ({
      date: moment().subtract(amount - i, "days").toDate(),
      value: value
    }));
  };

  /**
   * Lists test portfolio securities
   *
   * @param amount amount of portfolio securities to generate
   */
  export const listTestPortfolioSecurities = (amount: number): PortfolioSecurity[] => {
    return [ ...Array(amount).keys() ].map((_, i) => ({
      id: i.toString(),
      amount: (Math.random() * 100).toString(),
      purchaseValue: (Math.random() * 10000).toString(),
      totalValue: (Math.random() * 10000).toString()
    }));
  };

}

export default TestData;