import moment from "moment";
import BigNumber from "bignumber.js";
import { FundHistoryValue, PortfolioHistoryValue } from "../generated/client";
import { ChartRange, VictoryChartData } from "../types";

/**
 * Utility class for charts
 */
namespace ChartUtils {

  /**
   * Gets start date for chart query based on ChartRange value
   *
   * @param dateRange date range
   * @returns start date for query
   */
  export const getStartDate = (dateRange: ChartRange): Date => ({
    [ChartRange.MONTH]: moment().subtract(1, "month").toDate(),
    [ChartRange.YEAR]: moment().subtract(1, "year").toDate(),
    [ChartRange.THREE_YEARS]: moment().subtract(3, "years").toDate(),
    [ChartRange.FIVE_YEARS]: moment().subtract(5, "years").toDate(),
    [ChartRange.TEN_YEARS]: moment().subtract(10, "years").toDate(),
    [ChartRange.MAX]: moment().subtract(20, "years").toDate()
  })[dateRange];

  /**
   * Gets formatted display date string
   *
   * @param date date to format
   * @param format date format
   * @returns formatted date as string
   */
  export const getDisplayDate = (date: Date, format: string): string => {
    return moment(date).format(format);
  };

  /**
   * Converts historical values to victory chart data
   *
   * TODO: What to do in a case where there is no value or date?
   *
   * @param historicValues list of historical values
   * @returns list of VictoryChartData objects
   */
  export const convertToVictoryChartData = (historicValues: FundHistoryValue[]): VictoryChartData[] => (
    historicValues.map(value => ({
      x: value.date || new Date(),
      y: new BigNumber(value.value || 0).toNumber()
    }))
  );

  /**
   * Aggregates list of historical data lists into single list of historical values
   *
   * @param values list of historical data lists
   * @returns aggregated list of historical values
   */
  export const aggregateHistoricalData = (values: (PortfolioHistoryValue | FundHistoryValue)[][]): FundHistoryValue[] => {
    const historicalValueMaps = values.map(list => (
      list.reduce((map, { date, value }) => (
        date && value ? map.set(getDisplayDate(date, "DD-MM-YYYY"), value.toString()) : map
      ), new Map())
    ));

    const longestArray = values.reduce((longest, value) => (value.length > longest.length ? value : longest), []);

    return longestArray.map(({ date }) => ({
      date: date,
      value: historicalValueMaps.reduce((sum, map) => (
        !date ? sum : new BigNumber(sum).plus(map.get(getDisplayDate(date, "DD-MM-YYYY")) || 0).toString()
      ), "0")
    }));
  };

}

export default ChartUtils;