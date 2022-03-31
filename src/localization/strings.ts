import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";
import fi from "./fi.json";
import en from "./en.json";
import sv from "./sv.json";

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
    logout: string;
    webPage: string;
    reserve: string;
    cancel: string;
    save: string;
    noData: string;
    copied: string;
    saveAndProceed: string;
    ok: string;
    okay: string;
    pressAgainToExit: string;
  };

  /**
   * Translations for currencies
   */
  currency: {
    symbol: {
      EUR: string;
      SEK: string;
    }
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
    subscription: {
      invalidSum: string;
    };
    transactionDetails: {
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
    tryAgain: string;
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
    closed: string;
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
   * Translations related fund details screen
   */
  subscription: {
    settingsDescription: string;
    accountNumber: string;
    recipient: string;
    portfolio: string;
    referenceNumber: string;
    subscriptionAmount: string;
    dueDate: string;
    createVirtualBarCode: string;
    summaryDescription: string;
    customer: string;
    customerNumber: string;
    bank: string;
    shareType: string;
    sum: string;
    virtualBarCode: string;
    shares: {
      a: {
        title: string;
        recommended: string;
        description: string;
      };
      b: {
        title: string;
        description: string;
      };
    };
    nonSubscribableFund: {
      description: string;
      guideLink: string;
      videoBlog: string;
      videoBlogLink: string;
    };
    bankNames: {
      OP: string;
      NORDEA: string;
      "S-PANKKI": string;
    }
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
      securities: string;
      total: string;
      changeInGivenRange: string;
      noSecurities: string;
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
      security: string;
      valueDate: string;
      paymentDate: string;
      shareAmount: string;
      value: string;
      totalValue: string;
      provision: string;
      paidTotal: string;
    };
    distribution: {
      shareInterest: string;
      equityFunds: string;
      fixedIncomeFunds: string;
      combinationFunds: string;
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
      meetingCreatedDialog: {
        title: string;
        date: string;
        info1: string;
        info2: string;
        info3: string;
      };
    };
    newMeeting: {
      title: string;
      selectedTime: string;
      time: string;
      noAvailableTime: string;
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
        emailIsInvalid: string;
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
    loginRequired: string;
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
  };

}

const strings: Strings = new LocalizedStrings({
  en: en,
  fi: fi,
  sv: sv
}, { customLanguageInterface: () => "fi" });

export default strings;