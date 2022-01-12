/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import jwtDecode from "jwt-decode";
import { Authentication, ParsedToken } from "../types";
import Config from "../app/config";
import * as querystring from "query-string";

/** Offline token key in Expo secure store */
const OFFLINE_TOKEN_KEY = "offline-token";
const ANONYMOUS_ROLE = "anonymous";
const DEMO_ROLE = "demo";

/** Access token refresh slack */
const ACCESS_TOKEN_REFRESH_SLACK = 60;

/**
 * Utility class for authentication
 */
class AuthUtils {

  /**
   * Create authentication object from fetch response
   *
   * @param tokenResponse token response
   * @returns authentication object or undefined if token response does not contain access or refresh token
   */
  public static createAuthFromKeycloakTokenFetchResponse = (tokenResponse?: any): Authentication | undefined => {
    if (!tokenResponse) {
      return undefined;
    }

    const { access_token, refresh_token, expires_in } = tokenResponse;
    if (!access_token || !refresh_token || !expires_in) {
      return undefined;
    }

    return AuthUtils.createAuthentication(access_token, refresh_token, expires_in);
  };

  /**
   * Creates authentication from given parameters
   *
   * @param accessToken access token
   * @param refreshToken refresh token
   * @param expiresIn expires in
   * @returns created authentication object or undefined
   */
  public static createAuthentication = (
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): Authentication | undefined => {
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
      console.error(e);
      return undefined;
    }
  };

  /**
   * Create authentication object from expo token response
   *
   * @param tokenResponse token response
   * @returns authentication object or undefined if token response does not contain access or refresh token
   */
  public static createAuthFromExpoTokenResponse = (tokenResponse?: AuthSession.TokenResponse): Authentication | undefined => {
    if (!tokenResponse) {
      return undefined;
    }

    const { accessToken, refreshToken, expiresIn } = tokenResponse;
    if (!accessToken || !refreshToken || !expiresIn) {
      return undefined;
    }

    return AuthUtils.createAuthentication(accessToken, refreshToken, expiresIn);
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
      console.error(error);
    }
  };

  /**
   * Login with anonymous user account
   *
   * @returns promise of Authentication object or undefined
   */
  public static anonymousLogin = async (): Promise<Authentication | undefined> => {
    const { auth, anonymousPassword } = Config.getStatic();
    const tokenEndpoint = auth.serviceConfiguration?.tokenEndpoint;

    if (!tokenEndpoint) {
      throw new Error("Token endpoint is not defined");
    }

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        body: querystring.stringify({
          grant_type: "password",
          username: "anonymous",
          password: anonymousPassword,
          client_id: auth.clientId
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      return AuthUtils.createAuthFromKeycloakTokenFetchResponse(await response.json());
    } catch (error) {
      throw new Error("Login with anonymous user failed");
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

      const refreshedAuth = AuthUtils.createAuthFromExpoTokenResponse(tokenResponse);

      if (!refreshedAuth) {
        throw new Error("Token refreshing failed");
      }

      return refreshedAuth;
    } catch (error) {
      AuthUtils.removeOfflineToken();
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

  /**
   * Checks if user roles includes demo role
   *
   * @param auth auth state
   * @returns does user have demo role
   */
  public static isDemoUser = (auth?: Authentication): boolean => {
    return !!auth?.roles.realm.includes(DEMO_ROLE);
  };

  /**
   * Checks if user roles includes anonymous role
   *
   * @param auth auth state
   * @returns does user have anonymous role
   */
  public static isAnonymousUser = (auth?: Authentication): boolean => {
    return !!auth?.roles.realm?.includes(ANONYMOUS_ROLE);
  };

}

export default AuthUtils;