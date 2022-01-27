import moment from "moment";
import { LocalizedValue } from "../generated/client";
import strings from "../localization/strings";
import { Publication, PublicationDetails, SubscriptionSettings } from "../types";

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

  /**
   * Generates barcode
   * 
   * @param subscriptionSettings subscription settings
   */
  static generateBarCode = (subscriptionSettings: SubscriptionSettings) => {
    const { iBAN, dueDate, sum, referenceNumber } = subscriptionSettings;

    const rounded = parseFloat(sum).toFixed(2);
    const split = rounded.split(".");

    let euro = split[0];
    let cent = "00";

    const formattedDueDate = moment(dueDate).format("YYMMDD").toString();

    if (split.length > 1) {
      cent = split[1];
    }

    if (euro.length > 6) {
      euro = "000000";
      cent = "00";
    }

    const formattedIban = iBAN?.replace("FI", "").replace(/\s/g, "");
    const formattedReferenceNumber = (`00000000000000000000${referenceNumber}`).slice(-20);
    euro = (`000000${euro}`).slice(-6);
    cent = (`00${cent}`).slice(-2);

    return `4${formattedIban}${euro}${cent}000${formattedReferenceNumber}${formattedDueDate}`;
  };

}

export default GenericUtils;