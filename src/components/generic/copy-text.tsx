import React from "react";
import { Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { IconButton, useTheme } from "react-native-paper";
import styles from "../../styles/generic/copy-text";

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

  /**
   * Copies the string into clipboard 
   * 
   * @param value value to be copied
   */
  const copyToClipBoard = async (value: string) => {
    await Clipboard.setString(value);
    callback && callback();
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