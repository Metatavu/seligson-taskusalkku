import { LocalizedValue } from "../generated/client";
import strings from "../localization/strings";

/**
 * Returns localized string from given localized value
 */
class GenericUtils {

  /**
   * Returns localized string from given localized value
   *
   * @param value localized value
   * @returns localized string
   */
  static getLocalizedValue = (value: LocalizedValue) => value[strings.getLanguage() as keyof LocalizedValue] || value.fi;

}

export default GenericUtils;