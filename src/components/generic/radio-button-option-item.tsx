import React from "react";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "../../styles/generic/radio-button-option-item";
import theme from "../../theme";

/**
 * Component properties
 */
interface Props {
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
  label,
  value,
  checked,
  onPress,
  color,
  description
}) => (
  <View style={ styles.radioButtonContainer }>
    <RadioButton.Item
      label={ label }
      value={ value }
      status={ checked ? "checked" : "unchecked" }
      color={ color || theme.colors.primary }
      onPress={ () => onPress(value) }
      style={ styles.radioButtonReversed }
      labelStyle={[ theme.fonts.medium, styles[checked ? "checked" : "notSelected"] ]}
    />
    <Text style={[ !checked && styles.notSelected, !description && styles.noDescription ]}>
      { description }
    </Text>
  </View>
);

export default RadioButtonOptionItem;