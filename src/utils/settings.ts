import Config from "../app/config";
import { Language } from "../types/config";

namespace SettingsUtils {

  /**
   * Checks language
   */
  export const checkLanguage = async () => {
    const language = await Config.getLocalValue("@language");
    return language || Language.FI;
  };

}

export default SettingsUtils;