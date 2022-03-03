import { Fund } from "../generated/client";
import GenericUtils from "./generic";

/**
 * Namespace for fund utils
 */
namespace FundUtils {

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
   * Returns true if given fund is Seligson fund
   */
  export const isSeligsonFund = ({ longName }: Fund): boolean => GenericUtils.getLocalizedValue(longName).includes("Seligson");

}

export default FundUtils;