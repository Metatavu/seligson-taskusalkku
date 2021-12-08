import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { useAppDispatch } from "../../../app/hooks";
import { anonymousAuthUpdate, authUpdate } from "../../../features/auth/auth-slice";
import strings from "../../../localization/strings";
import AuthNavigator from "../../../types/navigators/auth";
import RootNavigator from "../../../types/navigators/root";
import AuthUtils from "../../../utils/auth";
import { ErrorContext } from "../../error-handler/error-handler";

/**
 * Custom navigation prop type for WelcomeScreen. Consists of AuthNavigator and RootNavigator
 */
type WelcomeScreenNavigationProp = CompositeNavigationProp<AuthNavigator.NavigationProps<"welcome">, RootNavigator.NavigationProps>;

/**
 * Welcome screen component
 */
const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const errorContext = React.useContext(ErrorContext);

  /**
   * Checks offline token
   */
  const checkOfflineToken = async () => {
    const offlineToken = await AuthUtils.retrieveOfflineToken();

    try {
      const auth = await AuthUtils.anonymousLogin();
      auth && dispatch(anonymousAuthUpdate(auth));
    } catch (error) {
      errorContext.setError(strings.errorHandling.auth.login, error);
    }

    if (offlineToken) {
      try {
        const auth = await AuthUtils.tryToRefresh(offlineToken);
        dispatch(authUpdate(auth));
      } catch (error) {
        errorContext.setError(strings.errorHandling.auth.login, error);
      }
    }

    navigation.replace("home");
  };

  /**
   * Effect for checking offline token
   */
  React.useEffect(() => { checkOfflineToken(); }, []);

  return null;
};

export default WelcomeScreen;