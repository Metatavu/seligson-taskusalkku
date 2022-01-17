import * as SecureStore from "expo-secure-store";

/** PIN code key in Expo secure store */
const PIN_CODE = "pin-code";

/**
 * Class providing utility methods for user authentication with PIN code
 */
namespace PinCodeAuth {

  /**
   * Checks if authentication with PIN code is enabled
   *
   * @returns true if PIN is enabled, otherwise false
   */
  export const enabled = async () => {
    try {
      return !!(await SecureStore.getItemAsync(PIN_CODE));
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  /**
   * Creates new PIN code
   *
   * @param pinCode PIN code
   * @returns promise of success
   */
  export const create = async (pinCode: string) => {
    try {
      await SecureStore.setItemAsync(PIN_CODE, pinCode);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Authenticate using given PIN code
   *
   * @param pinCode PIN code to authenticate with
   * @returns true if given PIN matches the saved one, otherwise false
   */
  export const authenticate = async (pinCode: string) => {
    try {
      const validator = await SecureStore.getItemAsync(PIN_CODE);
      return validator && validator === pinCode;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  /**
   * Removes authentication with PIN code
   *
   * @returns promise of success
   */
  export const remove = async () => {
    try {
      await SecureStore.deleteItemAsync(PIN_CODE);
    } catch (e) {
      console.error(e);
    }
  };

}

export default PinCodeAuth;