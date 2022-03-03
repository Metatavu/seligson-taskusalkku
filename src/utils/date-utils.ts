import moment from "moment";
import { ChartRange } from "../types";

/**
 * Namespace for date utils
 */
namespace DateUtils {
  /**
   * Formats date to Finnish DD.MM.YYYY format
   *
   * @param date date to format
   * @returns formatted date string
   */
  export const formatToFinnishDate = (date: Date | string) => moment(date).format("DD.MM.YYYY");

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
    [ChartRange.MAX]: moment().subtract(30, "years").toDate()
  })[dateRange];

  /**
   * Gets date filters based on date range
   *
   * @param dateRange selected date range (can be array of date or single ChartRange)
   * @returns start and end date for API calls
   */
  export const getDateFilters = (dateRange: Date[] | ChartRange): { startDate: Date, endDate: Date } => {
    if (Array.isArray(dateRange) && dateRange.length === 2) {
      return {
        startDate: dateRange[0],
        endDate: dateRange[1]
      };
    }

    const chartRange = dateRange as ChartRange;

    return {
      startDate: getStartDate(chartRange),
      endDate: new Date()
    };
  };

}

export default DateUtils;