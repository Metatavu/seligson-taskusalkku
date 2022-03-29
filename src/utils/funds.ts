import { Fund } from "../generated/client";
import { SecuritiesApiContextType } from "../types";
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
   * Returns true if given fund is Lähi-Tapiola fund
   */
  export const isLtFund = ({ longName }: Fund): boolean => longName.fi.includes("LähiTapiola");

  /**
   * Sorts given funds by name
   *
   * @param a fund A
   * @param b fund B
   */
  export const sortFundsByName = (a: Fund, b: Fund): number => {
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
    ...getSeligsonFunds(funds).sort(FundUtils.sortFundsByName),
    ...getLtFunds(funds).sort(FundUtils.sortFundsByName)
  ];

  /**
   * Resolves "main" security for the fund
   *
   * @param securitiesContext securities context
   * @param fundId fund id
   * @returns main security or null if not found
   */
  export const resolveMainSecurity = async (securitiesContext: SecuritiesApiContextType, fundId: string) => {
    const securitiesSeries1 = await securitiesContext.listSecurities({
      maxResults: 1,
      seriesId: 1,
      fundId: fundId
    });

    if (securitiesSeries1.length === 1) {
      return securitiesSeries1[0];
    }

    const securities = await securitiesContext.listSecurities({
      fundId: fundId
    });

    if (securities.length === 1) {
      return securities[0];
    }

    return null;
  };

}

export default FundUtils;