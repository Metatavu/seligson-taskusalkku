import moment from "moment";
import { HistoricalValue, PortfolioHistoryValue } from "../generated/client";
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
  export const convertToVictoryChartData = (historicValues: HistoricalValue[]): VictoryChartData[] => (
    historicValues.map(value => ({
      x: value.date || new Date(),
      y: value.value || 0
    }))
  );

  /**
   * Aggregates list of historical data lists into single list of historical values
   *
   * @param values list of historical data lists
   * @returns aggregated list of historical values
   */
  export const aggregateHistoricalData = (values: (PortfolioHistoryValue | HistoricalValue)[][]): HistoricalValue[] => {
    const historicalValueMaps = values.map(list => (
      list.reduce<Map<string, number>>((map, { date, value }) => {
        if (date && value) {
          map.set(moment(date).format("DD-MM-YYYY"), value);
        }

        return map;
      }, new Map())
    ));

    const longestArray = values.reduce((longest, value) => (value.length > longest.length ? value : longest), []);

    return longestArray.map(({ date }) => {
      const total = historicalValueMaps.reduce((sum, map) => {
        if (!date) {
          return sum;
        }

        const value = map.get(moment(date).format("DD-MM-YYYY"));
        return sum + (value || 0);
      }, 0);

      return { date: date, value: total };
    });
  };

}

export default ChartUtils;