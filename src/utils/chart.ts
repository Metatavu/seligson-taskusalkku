import moment from "moment";
import BigNumber from "bignumber.js";
import { PortfolioHistoryValue, SecurityHistoryValue } from "../generated/client";
import { ChartData, ChartRange, PortfolioSecurityCategory } from "../types";
import Calculations from "./calculations";
import DateUtils from "./date-utils";

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
   * Returns string key from given date
   *
   * @param date date
   */
  export const getDateKey = (date: Date) => moment(date).format("YYYY-MM-DD");

  /**
   * Translates list of history value lists to list of history value maps
   *
   * @param lists history value lists
   * @returns list of maps with date string keys and history value string values
   */
  export const translateToMaps = (lists: (PortfolioHistoryValue[] | SecurityHistoryValue[])[]): Map<string, string>[] => {
    const maps: Map<string, string>[] = [];

    lists.forEach(list => {
      const map = new Map<string, string>();

      list.forEach(({ date, value }) => {
        date && value && map.set(getDateKey(date), value.toString());
      });

      maps.push(map);
    });

    return maps;
  };

  /**
   * Returns all available keys from given list of history value lists
   *
   * @param lists list of lists
   * @returns list of keys
   */
  export const getAvailableKeys = (lists: (PortfolioHistoryValue[] | SecurityHistoryValue[])[]): string[] => (
    lists
      .reduce<SecurityHistoryValue[]>((longest, value) => (value.length > longest.length ? value : longest), [])
      .reduce<string[]>((list, { date }) => (date ? [ ...list, getDateKey(date) ] : list), [])
  );

  /**
   * Aggregates list of historical data lists into single list of historical values
   *
   * @param values list of historical data lists
   * @returns aggregated list of historical values
   */
  export const getAggregatedHistoryValues = (valueLists: (PortfolioHistoryValue | SecurityHistoryValue)[][]): SecurityHistoryValue[] => {
    const availableKeys = getAvailableKeys(valueLists);
    const historyValueMaps = translateToMaps(valueLists);

    const aggregatedHistoryValues: SecurityHistoryValue[] = [];
    const lastExistingValues: string[] = Array.from(new Array(availableKeys.length), () => "");

    availableKeys.forEach(key => {
      const aggregatedValue = historyValueMaps.reduce((sum, map, mapIndex) => {
        const previousValue = lastExistingValues[mapIndex];
        const currentValue = map.get(key);

        if (currentValue) {
          lastExistingValues[mapIndex] = currentValue;
        }

        return new BigNumber(sum)
          .plus(currentValue || previousValue || 0)
          .toString();
      }, "0");

      aggregatedHistoryValues.push({
        date: new Date(key),
        value: aggregatedValue
      });
    });

    return aggregatedHistoryValues;
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
      percentage: Calculations.formatPercentageNumberStr(
        new BigNumber(category.totalValue).dividedBy(sumValue).multipliedBy(100)
      )
    }));
  };

  /**
   * Compare security by their amount
   *
   * @param category1 category 1
   * @param category2 category 2
   */
  export const compareSecurityCategory = (category1: PortfolioSecurityCategory, category2: PortfolioSecurityCategory): number => {
    const totalValue1 = parseFloat(category1.totalValue) || 0;
    const totalValue2 = parseFloat(category2.totalValue) || 0;
    return totalValue1 - totalValue2;
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

  /**
   * Get display dates
   *
   * @param dateRange date range or array of dates
   * @returns display dates
   */
  export const getDisplayDates = (dateRange: Date[] | ChartRange) => {
    if (Array.isArray(dateRange) && dateRange.length === 2) {
      return {
        startDate: DateUtils.formatToFinnishDate(dateRange[0]),
        endDate: DateUtils.formatToFinnishDate(dateRange[1])
      };
    }

    const chartRange = dateRange as ChartRange;

    return {
      startDate: DateUtils.formatToFinnishDate(getStartDate(chartRange)),
      endDate: DateUtils.formatToFinnishDate(new Date())
    };
  };

  /**
   * Changes rgb-value to hex-value
   *
   * @param rgb rgb color as a string
   */
  export const RGBToHex = (rgb: string) => {
    const sep = rgb.indexOf(",") > -1 ? "," : " ";
    const rgbArray = rgb.substring(4).split(")")[0].split(sep);

    let r = (+rgbArray[0]).toString(16);
    let g = (+rgbArray[1]).toString(16);
    let b = (+rgbArray[2]).toString(16);

    if (r.length === 1) {
      r = `0${r}`;
    }

    if (g.length === 1) {
      g = `0${g}`;
    }

    if (b.length === 1) {
      b = `0${b}`;
    }

    return `#${r}${g}${b}`;
  };

}

export default ChartUtils;