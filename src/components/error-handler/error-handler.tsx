/* eslint-disable no-console */
import React from "react";
import { View } from "react-native";
import { Button, Paragraph } from "react-native-paper";
import strings from "../../localization/strings";
import styles from "../../styles/error-handler/error-handler";
import { ErrorContextType } from "../../types";
import BasicModal from "../generic/basic-modal";

/**
 * Error context initialization
 */
export const ErrorContext = React.createContext<ErrorContextType>({
  setError: () => {}
});

/**
 * Error context provider component
 *
 * @param props component properties
 */
const ErrorHandler: React.FC = ({ children }) => {
  const [ error, setError ] = React.useState<string>();

  /**
   * Tries to parse and log error object into readable format
   *
   * @param err error object to parse and log
   */
  const logErrorObject = async (err?: any) => {
    try {
      if (!(err instanceof Response)) {
        console.error(JSON.stringify(err, null, 2));
        return;
      }

      const responseText = await err.text();

      if (!responseText.startsWith("{")) {
        console.error(responseText);
        return;
      }

      console.error(JSON.stringify(responseText, null, 2));
    } catch {
      console.error(err.toString());
    }
  };

  /**
   * Handles error message and tries to print any given error to logs
   *
   * @param message error message
   * @param err any error
   */
  const handleError = (message: string, err?: any) => {
    setError(message);
    err && logErrorObject(err);
  };

  /**
   * Renders error modal
   */
  const renderErrorModal = () => {
    return (
      <BasicModal visible={ error !== undefined }>
        <View style={ styles.titleContainer }>
          <Paragraph>
            { error }
          </Paragraph>
        </View>
        <Button onPress={ () => setError(undefined) }>
          { strings.generic.close }
        </Button>
      </BasicModal>
    );
  };

  /**
   * Component render
   */
  return (
    <ErrorContext.Provider value={{ setError: React.useCallback(handleError, []) }}>
      { renderErrorModal() }
      { children }
    </ErrorContext.Provider>
  );
};

export default ErrorHandler;