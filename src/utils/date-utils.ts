import moment from "moment";

namespace DateUtils {
  /**
   * Formats date to Finnish DD.MM.YYYY format
   *
   * @param date date to format
   * @returns formatted date string
   */
  export const formatToFinnishDate = (date: Date | string) => moment(date).format("DD.MM.YYYY");

}

export default DateUtils;