import moment from "moment";
import { FundGroup, LocalizedValue } from "../generated/client";
import strings from "../localization/strings";
import { SubscriptionSettings } from "../types";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";
import theme from "../theme";

/**
 * Namespace for generic utility methods
 */
namespace GenericUtils {

  /**
   * Returns localized string from given localized value
   *
   * @param value localized value
   * @returns localized string
   */
  export const getLocalizedValue = (value: LocalizedValue) => value[strings.getLanguage() as keyof LocalizedValue] || value.fi;

  /**
   * Returns author from given publication or publication details
   *
   * @param publication publication
   */
  export const getPublicationAuthor = (author: string[]) => (
    author.length ? author.join(", ") : "Seligson"
  );

  /**
   * Check if date is within start and end date
   *
   * @param date date
   * @param startDate start date
   * @param endDate end date
   */
  export const checkDateInRange = (date?: Date, startDate?: Date, endDate?: Date) => {
    if (!date || !startDate || !endDate) {
      return true;
    }

    return moment(date).isAfter(startDate) && moment(date).isBefore(endDate);
  };

  /**
   * Returns bar code currency value based on given currency value string
   *
   * @param value currency value as string
   */
  export const getBarCodeCurrencyValue = (value: string) => {
    let [ euro, cents ] = parseFloat(value).toFixed(2).split(".");

    if (euro.length > 6) {
      euro = "0";
      cents = "0";
    }

    const euroString = `000000${euro}`.slice(-6);
    const centsString = `00${cents}`.slice(-2);
    return `${euroString}${centsString}`;
  };

  /**
   * Generates barcode
   * 
   * @param subscriptionSettings subscription settings
   */
  export const generateBarCode = (subscriptionSettings: SubscriptionSettings) => {
    const { iBAN, dueDate, sum, referenceNumber } = subscriptionSettings;

    const formattedIban = iBAN?.replace("FI", "").replace(/\s/g, "");
    const barCodeCurrencyValue = getBarCodeCurrencyValue(sum);
    const formattedReferenceNumber = (`00000000000000000000${referenceNumber}`).slice(-20);
    const formattedDueDate = moment(dueDate).format("YYMMDD").toString();

    return `4${formattedIban}${barCodeCurrencyValue}000${formattedReferenceNumber}${formattedDueDate}`;
  };

  /**
   * Opens file in Android platform
   *
   * @param url download url
   */
  export const openFileAndroid = async (url: string) => {
    const fileDir = `${FileSystem.cacheDirectory}/temp.pdf`;
    const file = await FileSystem.downloadAsync(url, fileDir);

    await FileSystem.getContentUriAsync(file.uri).then(cUri => {
      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        flags: 1,
        type: "application/pdf"
      });
    });
  };

  /**
   * Gets fund group color
   *
   * @param fundGroup fund group
   */
  export const getFundGroupColor = (fundGroup?: FundGroup) => (
    fundGroup ? theme.colors.fundGroup[fundGroup] : theme.colors.unSelected
  );

}

export default GenericUtils;