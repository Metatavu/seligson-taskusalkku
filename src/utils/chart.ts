import moment from "moment";
import { HistoricalValue } from "../generated/client";
import { ChartRange, VictoryChartData } from "../types";

/**
 * Utility class for charts
 */
export default class ChartUtils {
  
  /**
   * Gets start date for chart query based on ChartRange value
   *
   * @param dateRange date range
   * @returns start date for query
   */
  public static getStartDate = (dateRange: ChartRange): Date => ({
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
  public static getDisplayDate = (date: Date, format: string): string => {
    return moment(date).format(format);
  };

  /**
   * Converts historical values to victory chart data
   *
   * @param historicValues list of historical values
   * @returns list of VictoryChartData objects
   */
  public static convertToVictoryChartData = (historicValues: HistoricalValue[]): VictoryChartData[] => {
    return historicValues.map(value => ({
      x: value.date || new Date(),
      y: (value.value || 0)
    }));
  };

}