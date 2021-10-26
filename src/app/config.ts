import { cleanEnv, str, url, bool } from "envalid";
import Constants from "expo-constants";
import { StaticConfig, LocalConfig } from "../types/config";
import AppConfig from "../../app.json";
import { makeRedirectUri } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Validates that environment variables are in place and have correct form
 */
const env = cleanEnv(Constants.manifest?.extra, {
  REACT_APP_DEVELOP_BUILD: bool(),
  REACT_APP_KEYCLOAK_URL: url(),
  REACT_APP_KEYCLOAK_CLIENT_ID: str(),
  REACT_APP_KEYCLOAK_REALM: str(),
  REACT_APP_API_BASE_PATH: url()
});

/**
 * Class providing access to application configuration
 */
class Config {

  /**
   * Get static application configuration
   *
   * @returns promise of static application configuration
   */
  public static getStatic = (): StaticConfig => {
    const issuer = Config.getAuthIssuerUrl(env.REACT_APP_KEYCLOAK_URL, env.REACT_APP_KEYCLOAK_REALM);

    return {
      developmentBuild: env.REACT_APP_DEVELOP_BUILD,
      apiBasePath: env.REACT_APP_API_BASE_PATH,
      authLogoutEndpoint: `${issuer}/protocol/openid-connect/logout?redirect_uri=${Config.createRedirectUrl("Home", true)}`,
      auth: {
        clientId: env.REACT_APP_KEYCLOAK_CLIENT_ID,
        scopes: [ "openid", "profile", "offline_access" ],
        issuer: issuer,
        serviceConfiguration: {
          tokenEndpoint: `${issuer}/protocol/openid-connect/token`,
          authorizationEndpoint: `${issuer}/protocol/openid-connect/auth`,
          registrationEndpoint: `${issuer}/clients-registrations/openid-connect`,
          revocationEndpoint: `${issuer}/protocol/openid-connect/revoke`
        },
        redirectUrl: Config.createRedirectUrl("Home", true)
      }
    };
  };

  /**
   * Creates deep redirect URL to application
   *
   * @param path path inside application
   * @param removePort whether to remove port from URL or not
   * @returns redirect URL as string
   */
  public static createRedirectUrl = (path: string, removePort?: boolean): string => {
    const redirectUrl = makeRedirectUri({
      path: path,
      useProxy: false,
      scheme: AppConfig.expo.scheme
    });

    return removePort ? redirectUrl.replace(/:[0-9]{1,}/gm, "") : redirectUrl;
  };

  /**
   * Get URL for authorization issuer
   *
   * @param url authorization base url
   * @param realm authorization realm
   * @returns issuer URL
   */
  private static getAuthIssuerUrl = (baseUrl: string, realm: string): string => {
    return `${baseUrl}/realms/${realm}`;
  };

  /**
   * Returns local value with given key from Async storage
   *
   * @param key key of value in storage
   * @returns promise of value
   */
  public static getLocalValue = async <T extends keyof LocalConfig>(key: T): Promise<LocalConfig[T] | undefined> => {
    try {
      const result = await AsyncStorage.getItem(key);
      return result ? JSON.parse(result) : undefined;
    } catch (e) {
      return Promise.reject(Error(`Failed to get value from AsyncStorage. Error: ${e}`));
    }
  };

  /**
   * Set local value to Async storage
   *
   * @param key key of value in storage
   * @param value value to set
   * @returns promise of successful operation
   */
  public static setLocalValue = async <T extends keyof LocalConfig>(key: T, value: LocalConfig[T]): Promise<LocalConfig[T]> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      const updatedValue = await AsyncStorage.getItem(key);

      if (!updatedValue) {
        return await Promise.reject(Error("Failed to set value to AsyncStorage"));
      }

      return JSON.parse(updatedValue);
    } catch (e) {
      return Promise.reject(Error(`Failed to set value to AsyncStorage. Error: ${e}`));
    }
  };

  /**
   * Removes local value from Async storage
   *
   * @param key ket of value in storage
   * @returns promise of successful removal
   */
  public static removeLocalValue = async <T extends keyof LocalConfig>(key: T): Promise<void> => {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (e) {
      return Promise.reject(Error(`Failed to set value to AsyncStorage. Error: ${e}`));
    }
  };

}

export default Config;