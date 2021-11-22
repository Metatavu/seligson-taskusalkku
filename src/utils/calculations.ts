/**
 * Custom namespace for calculations
 */
namespace Calculations {

  /**
   * Gets current total change amount
   *
   * @param purchaseValue purchase value
   * @param totalValue total value
   * @returns calculated amount
   */
  export const getTotalChangeAmount = (purchaseValue?: number, totalValue?: number): number => {
    if (!purchaseValue || !totalValue) {
      return 0;
    }

    return totalValue - purchaseValue;
  };
  
  /**
   * Gets current total change in percentages
   *
   * @param purchaseValue purchase value
   * @param totalValue total value
   * @returns calculated percentage
   */
  export const getTotalChangePercentage = (purchaseValue?: number, totalValue?: number): string => {
    if (!purchaseValue || !totalValue) {
      return "0";
    }

    return (((totalValue * 100) / purchaseValue) - 100).toFixed(2);
  };

}

export default Calculations;