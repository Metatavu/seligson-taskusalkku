import moment from "moment";
import { LocalizedValue } from "../generated/client";
import strings from "../localization/strings";
import { Publication, PublicationDetails } from "../types";

/**
 * Class for generic utility methods
 */
class GenericUtils {

  /**
   * Returns localized string from given localized value
   *
   * @param value localized value
   * @returns localized string
   */
  static getLocalizedValue = (value: LocalizedValue) => value[strings.getLanguage() as keyof LocalizedValue] || value.fi;

  /**
   * Returns author from given publication or publication details
   *
   * @param publication publication
   */
  static getPublicationAuthor = ({ author }: Publication | PublicationDetails) => (
    author.length ? author.join(", ") : "Seligson"
  );

  /**
   * Check if date is within start and end date
   *
   * @param date date
   * @param startDate start date
   * @param endDate end date
   */
  static checkDateInRange = (date?: Date, startDate?: Date, endDate?: Date) => {
    if (!date || !startDate || !endDate) {
      return true;
    }

    return moment(date).isAfter(startDate) && moment(date).isBefore(endDate);
  };

}

export default GenericUtils;