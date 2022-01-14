/* eslint-disable @typescript-eslint/return-await */
import { hasHardwareAsync, supportedAuthenticationTypesAsync, isEnrolledAsync, authenticateAsync } from "expo-local-authentication";
import strings from "../localization/strings";

/**
 * Class providing utility methods for user authentication with biometric authentication methods
 */
namespace BiometricAuth {

  /**
   * Attempts to authenticate user using available biometric authentication method
   *
   * @returns promise of whether user is authenticated or not
   */
  export const authenticate = async (): Promise<boolean> => {
    if (!await BiometricAuth.supported()) {
      throw new Error("No biometric authentication methods supported by device.");
    }

    if (!await BiometricAuth.enrolled()) {
      throw new Error("No biometric authentication methods enabled.");
    }

    const { success } = await authenticateAsync({
      promptMessage: strings.auth.loginWithBiometric,
      cancelLabel: strings.generic.cancel,
      disableDeviceFallback: true
    });

    return success;
  };

  /**
   * Returns whether any biometric authentication method is supported
   *
   * @returns promise of whether biometric authentication is supported or not
   */
  export const supported = async (): Promise<boolean> => {
    try {
      const [ hasHardware, supportedAuthTypes ] = await Promise.all([
        hasHardwareAsync(),
        supportedAuthenticationTypesAsync()
      ]);

      return hasHardware && !!supportedAuthTypes.length;
    } catch (e) {
      throw new Error(`Failed to check biometric auth support. Error: ${e}`);
    }
  };

  /**
   * Returns whether supported biometric authentication has been configured and enrolled
   *
   * @returns promise of whether biometric authentication is enrolled or not
   */
  export const enrolled = async (): Promise<boolean> => {
    try {
      return isEnrolledAsync();
    } catch (e) {
      throw new Error(`Failed to check biometric auth enabled. Error: ${e}`);
    }
  };

}

export default BiometricAuth;