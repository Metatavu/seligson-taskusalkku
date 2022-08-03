import { PORTFOLIO_REFERENCE_TYPE, SubscriptionSettings } from "../types";

/**
 * Utility methods for portfolios
 */
namespace PortfolioUtils {
  
  /**
   * Returns reference number from subscription settings
   *
   * @param subscriptionSettings subscription settings
   * @returns reference number
   */
  export const getReferenceNumber = (subscriptionSettings: SubscriptionSettings) => {
    const { shareType, portfolio } = subscriptionSettings;

    if (shareType === PORTFOLIO_REFERENCE_TYPE.B) {
      return portfolio?.bReference;
    }

    return portfolio?.aReference;
  };

}

export default PortfolioUtils;