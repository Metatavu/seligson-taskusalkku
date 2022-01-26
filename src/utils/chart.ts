import moment from "moment";
import BigNumber from "bignumber.js";
import { PortfolioHistoryValue, SecurityHistoryValue } from "../generated/client";
import { ChartData, ChartRange, PortfolioSecurityCategory } from "../types";

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
   * Converts historical values to chart data
   *
   * TODO: What to do in a case where there is no value or date?
   *
   * @param historicValues list of historical values
   * @returns list of ChartData objects
   */
  export const convertToChartData = (historicValues: SecurityHistoryValue[]): ChartData[] => (
    historicValues.filter(value => value.value !== "0").map(value => ({
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
  export const aggregateHistoricalData = (values: (PortfolioHistoryValue | SecurityHistoryValue)[][]): SecurityHistoryValue[] => {
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

  /**
   * Aggregates securities
   *
   * @param categories categories
   */
  export const aggregateSecurityCategories = (categories: PortfolioSecurityCategory[]): PortfolioSecurityCategory[] => {
    const securityMap = new Map<string, PortfolioSecurityCategory>();

    let sumValue = new BigNumber("0");
    categories.forEach(category => {
      const storedCategory = securityMap.get(category.fundId);

      const currentNumber = new BigNumber(category.totalValue);
      const updatedCategory: PortfolioSecurityCategory = {
        ...category,
        totalValue: new BigNumber(storedCategory?.totalValue || "0").plus(currentNumber).toString()
      };
      sumValue = sumValue.plus(currentNumber);
      securityMap.set(updatedCategory.fundId, updatedCategory);
    });

    const aggregatedList = Array.from(securityMap.values());
    return aggregatedList.map(category => ({
      ...category,
      percentage: `${(new BigNumber(category.totalValue)).dividedBy(sumValue).multipliedBy(100).toFormat(2)} %`
    }));
  };

  /**
   * Compare security by their amount
   *
   * @param category1 category 1
   * @param category2 category 2
   */
  export const compareSecurityCategory = (category1: PortfolioSecurityCategory, category2: PortfolioSecurityCategory): number => {
    return category1.totalValue.localeCompare(category2.totalValue);
  };

  /**
   * Gets skip value for historical value calculations based on the selected chart range
   *
   * @param dateRange selected date range
   * @returns skip value
   */
  export const getSkipValue = (dateRange: Date[] | ChartRange): number => {
    if (Array.isArray(dateRange)) {
      // TODO: Add logic to check how long the date range is
      return 20;
    }

    return ({
      [ChartRange.MONTH]: 1,
      [ChartRange.YEAR]: 2,
      [ChartRange.THREE_YEARS]: 10,
      [ChartRange.FIVE_YEARS]: 20,
      [ChartRange.TEN_YEARS]: 30,
      [ChartRange.MAX]: 80
    })[dateRange as ChartRange];
  };
}

export default ChartUtils;