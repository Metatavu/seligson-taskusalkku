import React from "react";
import { StyleProp, View, Text, ViewStyle } from "react-native";
import { RadioButton } from "react-native-paper";
import strings from "../../localization/strings";
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
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
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
  style,
  description,
  disabled
}) => (
  <View style={ style || styles.radioButtonContainer }>
    <RadioButton.Item
      label={ label }
      value={ value }
      status={ checked ? "checked" : "unchecked" }
      color={ color || theme.colors.primary }
      onPress={ () => onPress(value) }
      style={ styles.radioButtonReversed }
      labelStyle={[ theme.fonts.medium, styles[checked ? "checked" : "notSelected"] ]}
      disabled={ disabled }
    />
    <Text style={[ { color: theme.colors.primary }, !checked && styles.notSelected, !description && styles.noDescription ]}>
      { description }
    </Text>
    { disabled &&
      <Text style={[ { color: theme.colors.primary }, !checked && styles.notSelected, styles.needsLogin ]}>
        { strings.settingsScreen.loginRequired }
      </Text>
    }
  </View>
);

export default RadioButtonOptionItem;