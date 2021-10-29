import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import jwtDecode from "jwt-decode";
import { Authentication, ParsedToken } from "../types";
import Config from "../app/config";

/** Offline token key in Expo secure store */
const OFFLINE_TOKEN_KEY = "offline-token";

/** Access token refresh slack */
const ACCESS_TOKEN_REFRESH_SLACK = 60;

/**
 * Utility class for authentication
 */
class AuthUtils {

  /**
   * Create authentication object from authentication token response
   *
   * @param tokenResponse token response
   * @returns authentication object or undefined if token response does not contain access or refresh token
   */
  public static createAuth = (tokenResponse?: AuthSession.TokenResponse): Authentication | undefined => {
    if (!tokenResponse) {
      return undefined;
    }

    const { accessToken, refreshToken, expiresIn } = tokenResponse;
    if (!accessToken || !refreshToken || !expiresIn) {
      return undefined;
    }

    try {
      const parsedToken = jwtDecode<ParsedToken>(accessToken);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: parsedToken.sub,
        roles: {
          realm: parsedToken.realm_access.roles,
          resource: parsedToken.resource_access.account.roles
        },
        expiresAt: moment().add(expiresIn, "seconds").toDate()
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return undefined;
    }
  };

  /**
   * Encrypts and saves offline token to Expo secure store
   *
   * @param token token string
   */
  public static saveOfflineToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync(OFFLINE_TOKEN_KEY, token);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * Retrieves offline token from Expo secure store
   *
   * @returns offline token if found or undefined
   */
  public static retrieveOfflineToken = async () => {
    try {
      return await SecureStore.getItemAsync(OFFLINE_TOKEN_KEY) ?? undefined;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return undefined;
    }
  };

  /**
   * Removes offline token from Expo secure store
   */
  public static removeOfflineToken = async () => {
    try {
      await SecureStore.deleteItemAsync(OFFLINE_TOKEN_KEY);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * Tries to refresh token and returns authentication with fresh token if successful
   *
   * @param auth authentication
   * @returns promise of refreshed authentication
   */
  public static tryToRefresh = async (refreshToken: string): Promise<Authentication> => {
    try {
      const { clientId, scopes, serviceConfiguration } = Config.getStatic().auth;
      if (!clientId || !scopes || !serviceConfiguration) {
        throw new Error("Configuration not in place");
      }

      const tokenResponse = await AuthSession.refreshAsync(
        {
          clientId: clientId,
          scopes: scopes,
          refreshToken: refreshToken
        },
        serviceConfiguration
      );

      const refreshedAuth = AuthUtils.createAuth(tokenResponse);

      if (!refreshedAuth) {
        throw new Error("Token refreshing failed");
      }

      return refreshedAuth;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(JSON.stringify(error, null, 2));
      return Promise.reject(error);
    }
  };

  /**
   * Helper method to check if authentication needs to be refreshed
   *
   * @returns if authentication needs refreshing or not
   */
  public static needsRefresh = ({ expiresAt }: Authentication): boolean => {
    if (!expiresAt) {
      return false;
    }

    const currentTime = moment();
    const refreshTimeWithSlack = moment(expiresAt).subtract(ACCESS_TOKEN_REFRESH_SLACK, "seconds");
    return currentTime.isAfter(refreshTimeWithSlack);
  };

  /**
   * Logs out session of given token
   *
   * @param token token to logout
   */
  public static logout = async (token: string) => {
    try {
      const { scopes, serviceConfiguration } = Config.getStatic().auth;
      if (!scopes || !serviceConfiguration) {
        throw new Error("Configuration not in place");
      }

      await AuthSession.revokeAsync(
        {
          scopes: scopes,
          token: token
        },
        serviceConfiguration
      );
    } catch (error) {
      return Promise.reject(Error(`Could not logout. Error: ${error}`));
    }
  };

}

export default AuthUtils;