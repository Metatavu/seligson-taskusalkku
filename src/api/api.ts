import { Configuration, FundsApi } from "../generated/client";
import { Authentication } from "../types";
import Config from "../app/config";

/**
 * Utility class for loading api with predefined configuration
 */
export default class Api {
  
  /**
   * Gets initialized funds api
   * 
   * @param auth authentication
   * @returns initialized funds api
   */
  public static getFundsApi = (auth: Authentication) => {
    return new FundsApi(Api.getConfiguration(auth));
  };

  /**
   * Gets api configuration
   *
   * @param auth authentication
   * @returns new configuration
   */
  private static getConfiguration = ({ accessToken }: Authentication) => {
    if (!accessToken) {
      throw Error("Get configuration failed - no access token");
    }

    return new Configuration({
      basePath: Config.getStatic().apiBasePath,
      accessToken: accessToken
    });
  };

}