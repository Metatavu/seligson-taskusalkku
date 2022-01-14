import React from "react";
import { View } from "react-native";
import { RadioButton, Text } from "react-native-paper";
import styles from "../../styles/generic/radio-button-option-item";
import theme from "../../theme";

/**
 * Component properties
 */
interface Props {
  key: string;
  label: string;
  value: any;
  checked: boolean;
  onPress: (value: any) => void;
  color?: string;
  description?: string;
}

/**
 * Radio button option item component
 */
const RadioButtonOptionItem: React.FC<Props> = ({
  key,
  label,
  value,
  checked,
  onPress,
  color,
  description
}) => (
  <View style={ styles.radioButtonContainer }>
    <RadioButton.Item
      key={ key }
      label={ label }
      value={ value }
      status={ checked ? "checked" : "unchecked" }
      color={ color || theme.colors.primary }
      onPress={ () => onPress(value) }
      style={ styles.radioButtonReversed }
      labelStyle={ !checked && styles.notSelected }
    />
    <Text style={ [ styles.radioButtonDescription, !checked && styles.notSelected ] }>
      { description }
    </Text>
  </View>
);

export default RadioButtonOptionItem;