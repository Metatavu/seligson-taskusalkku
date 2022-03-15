import { Fund } from "../generated/client";
import GenericUtils from "./generic";

/**
 * Namespace for fund utils
 */
namespace FundUtils {

  /**
   * Returns true if given fund is Seligson fund
   */
  export const isSeligsonFund = ({ longName }: Fund): boolean => GenericUtils.getLocalizedValue(longName).includes("Seligson");

  /**
   * Sorts given funds by name
   *
   * @param a fund A
   * @param b fund B
   */
  export const SortFundsByName = (a: Fund, b: Fund): number => {
    const nameA = a.longName.fi;
    const nameB = b.longName.fi;
    return nameA.localeCompare(nameB);
  };

  /**
   * Returns Lähitapiola funds from given list
   *
   * @param funds funds
   */
  export const getLtFunds = (funds: Fund[]) => funds.filter(fund => !isSeligsonFund(fund));

  /**
   * Returns Seligson funds from given list
   *
   * @param funds funds
   */
  export const getSeligsonFunds = (funds: Fund[]) => funds.filter(isSeligsonFund);

  /**
   * Sorts funds with following criteria:
   * - Seligson funds first, Lähitapiola second
   * - ascending names
   *
   * @param funds funds
   */
  export const sortFunds = (funds: Fund[]) => [
    ...getSeligsonFunds(funds).sort(FundUtils.SortFundsByName),
    ...getLtFunds(funds).sort(FundUtils.SortFundsByName)
  ];

}

export default FundUtils;