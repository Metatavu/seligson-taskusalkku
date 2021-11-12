import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";
import fi from "./fi.json";
import en from "./en.json";

/**
 * Interface describing localized strings
 */
export interface Strings extends LocalizedStringsMethods {

  /**
   * Translations related to generic words
   */
  generic: {
    notImplemented: string;
    close: string;
    back: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
  };

  /**
   * Translations related to authentication
   */
  auth: {
    loginSessionExpiredTitle: string;
    loginSessionExpiredContent: string;
  };

  /**
   * Translations related to screen titles
   */
  screenTitles: {
    portfolio: string;
    funds: string;
    publications: string;
    others: string;
    statistics: string;
    distributions: string;
    ownFunds: string;
    events: string;
    passiveFunds: string;
    activeFunds: string;
    interestFunds: string;
    combinationFunds: string;
    profile: string;
  };
  
  /**
   * Translations related to fund card
   */
  fundCard: {
    riskLevel: string;
    historyOneDay: string;
    historyOneMonth: string;
    historyOneYear: string;
    historyFiveYears: string;
    historyTwentyYears: string;
  };
  
  /**
   * Translations related funde details screen
   */
  fundDetailsScreen: {
    amount: string;
    value: string;
    change: string;
    buyFund: string;
    downloadBrochure: string;
    aShare: string;
    bShare: string;
    myShare: string;
  };

}

const strings: Strings = new LocalizedStrings({ en: en, fi: fi });

export default strings;