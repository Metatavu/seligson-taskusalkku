import strings from "../localization/strings";
import { DefaultRoutes, Language, LoginOptions } from "../types/config";

/**
 * Custom namespace for translations
 */
namespace TranslationUtils {

  /**
   * Gets default route option display text object
   *
   * @param route default route options
   * @returns object that contains title and description
   */
  export const getDefaultRouteDisplayText = (route: DefaultRoutes) => ({
    [DefaultRoutes.PORTFOLIO]: strings.defaultRoutes.portfolio,
    [DefaultRoutes.FUNDS]: strings.defaultRoutes.funds
  })[route];

  /**
   * Gets login option display text object
   *
   * @param option login option
   * @returns object that contains title and description
   */
  export const getLoginOptionDisplayText = (option: LoginOptions) => ({
    [LoginOptions.BIOMETRIC]: strings.loginOptions.biometric,
    [LoginOptions.PIN]: strings.loginOptions.pin,
    [LoginOptions.STRONG_AUTH]: strings.loginOptions.strongAuth,
    [LoginOptions.USERNAME_AND_PASSWORD]: strings.loginOptions.usernameAndPassword,
    [LoginOptions.DEMO]: strings.loginOptions.demo
  })[option];

  /**
   * Gets display text for given language
   *
   * @param language language
   * @returns display text for language
   */
  export const getLanguageDisplayText = (option: Language) => ({
    [Language.FI]: strings.languages.fi,
    [Language.EN]: strings.languages.en
  })[option];

}

export default TranslationUtils;