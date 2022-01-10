import { LocalizedValue } from "../generated/client";
import strings from "../localization/strings";
import { Publication, PublicationDetails } from "../types";

/**
 * Class for generic utility methods
 */
class GenericUtils {

  /**
   * Returns localized string from given localized value
   *
   * @param value localized value
   * @returns localized string
   */
  static getLocalizedValue = (value: LocalizedValue) => value[strings.getLanguage() as keyof LocalizedValue] || value.fi;

  /**
   * Returns author from given publication or publication details
   *
   * @param publication publication
   */
  static getPublicationAuthor = ({ author }: Publication | PublicationDetails) => (
    author.length ? author.join(", ") : "Seligson"
  );

}

export default GenericUtils;