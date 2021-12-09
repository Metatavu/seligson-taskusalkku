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
    login: string;
    webPage: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
    funds: {
      list: string;
    };
    fundHistory: {
      list: string;
    };
    portfolio: {
      list: string;
    };
    portfolioFunds: {
      list: string;
    };
    auth: {
      login: string;
    };
  };

  /**
   * Translations related to authentication
   */
  auth: {
    loginSessionExpiredTitle: string;
    loginSessionExpiredContent: string;
    loginRequired: string;
    newAccount: string;
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
    transactions: string;
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
    historyThreeYears: string;
    historyFiveYears: string;
    historyTenYears: string;
    historyTwentyYears: string;
    historyMax: string;
  };
  
  /**
   * Translations related fund details screen
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

  /**
   * Translations related to portfolio
   */
  portfolio: {
    statistics: {
      marketValueTotal: string;
      purchaseTotal: string;
      change: string;
      totalChange: string;
      redemptions: string;
      subscriptions: string;
      total: string;
    };
    portfolioFunds: {
      title: string;
    };
    select: {
      all: string;
    };
    transactions: {
      type: string;
      redemption: string;
      subscription: string;
      valueDate: string,
      paymentDate: string,
      shareAmount: string,
      value: string;
      totalValue: string;
      provision: string,
      paidTotal: string,

    };
  };

}

const strings: Strings = new LocalizedStrings({ en: en, fi: fi });

export default strings;