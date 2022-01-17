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
    reserve: string;
    cancel: string;
    save: string;
    noData: string;
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
    securities: {
      list: string;
      find: string;
    };
    portfolio: {
      list: string;
    };
    portfolioSecurities: {
      list: string;
    };
    auth: {
      login: string;
      biometric: string;
    };
    meetingTimes: {
      list: string;
    };
    meeting: {
      create: string
    };
    portfolioTransactions: {
      list: string;
    };
    publications: {
      list: string;
      find: string;
    };
  };

  /**
   * Translations related to authentication
   */
  auth: {
    loginSessionExpiredTitle: string;
    loginSessionExpiredContent: string;
    loginRequired: string;
    login: string;
    newAccount: string;
    inputPinCode: string;
    incorrectPinCode: string;
    loginWithBiometric: string;
  };

  /**
   * Translations related to screen titles
   */
  screenTitles: {
    portfolio: string;
    funds: string;
    publications: string;
    meetings: string;
    reviews: string;
    topical: string;
    questions: string;
    phoebus: string;
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
    portfolioSecurities: {
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
      provision: string;
      paidTotal: string;
    };
  };

  /**
   * Translations related to meetings screen
   */
  meetings: {
    meetingTimes: {
      bookTime: string;
      bookTimeDescription: string;
      datePicker: {
        title: string;
        pickDateTime: string;
        noAppointment: string;
        startDate: string;
        endDate: string;
      };
    };
    newMeeting: {
      title: string;
      selectedTime: string;
      time: string;
      meetingType: {
        title: string;
        phone: string;
        meeting: string;
      };
      meetingLanguage: string;
      participantCount: string;
      contact: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      },
      additionalInformation: string;
    };
  };

  /**
   * Translations related to settings screen
   */
  settingsScreen: {
    initialRoute: string;
    preferredLogin: string;
    language: string;
  };

  /**
   * Translations related to login options
   */
  loginOptions: {
    usernameAndPassword: {
      title: string;
      description: string;
    };
    pin: {
      title: string;
      description: string;
    };
    biometric: {
      title: string;
      description: string;
    };
    strongAuth: {
      title: string;
      description: string;
    };
    demo: {
      title: string;
      description: string;
    };
  };

  /**
   * Translations related to default routes
   */
  defaultRoutes: {
    portfolio: {
      title: string;
      description: string;
    };
    funds: {
      title: string;
      description: string;
    };
  };

  /**
   * Translations related to languages
   */
  languages: {
    fi: string;
    en: string;
    sv: string;
  }

}

const strings: Strings = new LocalizedStrings({ en: en, fi: fi });

export default strings;