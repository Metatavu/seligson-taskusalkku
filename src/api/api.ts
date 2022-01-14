import { Configuration, FundsApi, MeetingsApi, PortfoliosApi, SecuritiesApi } from "../generated/client";
import { Authentication } from "../types";
import Config from "../app/config";

/**
 * Utility class for loading APIs with predefined configuration
 */
export default class Api {

  /**
   * Gets initialized funds API
   *
   * @param auth authentication
   * @returns initialized funds API
   */
  public static getFundsApi = (auth: Authentication): FundsApi => (
    new FundsApi(Api.getConfiguration(auth))
  );

  /**
   * Gets initialized securities API
   *
   * @param auth authentication
   * @returns initialized securities API
   */
  public static getSecuritiesApi = (auth: Authentication): SecuritiesApi => (
    new SecuritiesApi(Api.getConfiguration(auth))
  );

  /**
   * Gets initialized meetings api
   * 
   * @param auth authentication
   * @returns initialized meetings api
   */
  public static getMeetingsApi = (auth: Authentication): MeetingsApi => {
    return new MeetingsApi(Api.getConfiguration(auth));
  };

  /**
   * Gets initialized portfolios API
   *
   * @param auth authentication
   * @returns initialized portfolios API
   */
  public static getPortfoliosApi = (auth: Authentication): PortfoliosApi => (
    new PortfoliosApi(Api.getConfiguration(auth))
  );

  /**
   * Gets API configuration
   *
   * @param auth authentication
   * @returns new configuration
   */
  private static getConfiguration = ({ accessToken }: Authentication) => (
    new Configuration({
      basePath: Config.getStatic().apiBasePath,
      accessToken: accessToken
    })
  );

}