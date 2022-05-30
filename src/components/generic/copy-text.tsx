import React, { useContext } from "react";
import { Text, View, Clipboard } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import strings from "../../localization/strings";
import styles from "../../styles/generic/copy-text";
import { ErrorContext } from "../error-handler/error-handler";

/**
 * Component properties
 */
interface Props {
  multiline?: boolean;
  text: string;
  width: number;
  callback?: () => void;
}

/**
 * Copy text component
 *
 * @param props component properties
 */
const CopyText: React.FC<Props> = ({
  text,
  width,
  multiline,
  callback
}) => {
  const { colors } = useTheme();
  const errorContext = useContext(ErrorContext);

  /**
   * Copies the string into clipboard 
   * 
   * @param value value to be copied
   */
  const copyToClipBoard = async (value: string) => {
    try {
      await Clipboard.setString(value);
      callback && callback();
    } catch (error) {
      errorContext.setError(strings.errorHandling.generic.copy, error);
    }
  };

  /**
   * Render inline text
   */
  const renderInLineText = () => (
    <Text numberOfLines={ 1 } style={{ maxWidth: width }}>
      { text }
    </Text>
  );

  /**
   * Render multiline text
   */
  const renderMultilineText = () => (
    <Text style={{ maxWidth: width }}>
      { text }
    </Text>
  );

  /**
   * Component render
   */
  return (
    <View style={ styles.copyText }>
      {
        multiline ?
          renderMultilineText() :
          renderInLineText()
      }
      <IconButton
        icon="content-copy"
        color={ colors.primary }
        size={ 15 }
        onPress={ () => copyToClipBoard(text) }
      />
    </View>
  );
};

export default CopyText;