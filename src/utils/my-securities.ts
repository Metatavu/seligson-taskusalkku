import { MySecurityInfo } from "../types";
import GenericUtils from "./generic";

/**
 * Namespace for my security utility functions
 */
namespace MySecurityUtils {

  /**
   * Returns true if given my security is part of Seligson fund
   */
  export const isSeligsonFund = ({ fund: { longName } }: MySecurityInfo): boolean =>
    GenericUtils.getLocalizedValue(longName).includes("Seligson");

  /**
    * Returns true if given my security is part of Lähi-Tapiola fund
    */
  export const isLtFund = ({ fund: { longName } }: MySecurityInfo): boolean =>
    GenericUtils.getLocalizedValue(longName).includes("LähiTapiola");

  /**
   * Sorts given my securities by name
   *
   * @param a my security A
   * @param b my security B
   */
  export const sortMySecuritiesByName = (a: MySecurityInfo, b: MySecurityInfo): number => {
    const nameA = a.fund.longName.fi;
    const nameB = b.fund.longName.fi;
    return nameA.localeCompare(nameB);
  };

  /**
   * Returns my securities from given list belonging to LähiTapiola fund
   *
   * @param mySecurities my securities
   */
  export const getLtFunds = (mySecurities: MySecurityInfo[]) =>
    mySecurities.filter(mySecurity => !isSeligsonFund(mySecurity));

  /**
    * Returns my securities from given list belonging to Seligson fund
    *
    * @param mySecurities my securities
    */
  export const getSeligsonFunds = (mySecurities: MySecurityInfo[]) => mySecurities.filter(isSeligsonFund);

  /**
   * Sorts given my securities
   *
   * @param mySecurities my securities
   */
  export const sortMySecurities = (mySecurities: MySecurityInfo[]) => [
    ...getSeligsonFunds(mySecurities).sort(MySecurityUtils.sortMySecuritiesByName),
    ...getLtFunds(mySecurities).sort(MySecurityUtils.sortMySecuritiesByName)
  ];

}

export default MySecurityUtils;