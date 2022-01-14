import React from "react";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import styles from "../../styles/generic/pin-input";
import { Text, View } from "react-native";
import { Button, Modal } from "react-native-paper";
import strings from "../../localization/strings";
import theme from "../../theme";

/**
 * Component properties
 */
interface Props {
  inputOpen: boolean;
  onSave: (pinCode: string) => void;
  onCancel: () => void;
  error?: boolean;
  confirmButtonLabel?: string;
}

/**
 * PIN input component
 *
 * @param props component properties
 */
const PinInput: React.FC<Props> = ({
  inputOpen,
  onSave,
  onCancel,
  error,
  confirmButtonLabel
}) => {
  const [ pinValue, setPinValue ] = React.useState<string>("");

  const ref = useBlurOnFulfill({ value: pinValue, cellCount: 4 });
  const [ codeFieldProps, getCellOnLayoutHandler ] = useClearByFocusCell({ value: pinValue, setValue: setPinValue });

  /**
   * Event handler for on save pin code
   */
  const onSavePinCode = () => {
    onSave(pinValue);
    setPinValue("");
  };

  /**
   * Event handler for on cancel pin code click
   */
  const onCancelPinCode = () => {
    onCancel();
    setPinValue("");
  };

  /**
   * Renders action buttons
   */
  const renderActionButtons = () => (
    <View style={ styles.actionButtonsContainer }>
      <Button
        uppercase={ false }
        onPress={ onSavePinCode }
        disabled={ pinValue.length !== 4 }
      >
        { confirmButtonLabel || strings.generic.save }
      </Button>
      <Button
        uppercase={ false }
        onPress={ onCancelPinCode }
        color={ theme.colors.error }
      >
        { strings.generic.cancel }
      </Button>
    </View>
  );

  /**
   * Component render
   */
  return (
    <Modal
      visible={ inputOpen }
      contentContainerStyle={ styles.modalContainer }
    >
      <View style={ styles.titleContainer }>
        <Text style={ styles.title }>
          { strings.auth.inputPinCode }
        </Text>
      </View>
      <CodeField
        ref={ ref }
        { ...codeFieldProps }
        caretHidden={ false }
        value={ pinValue }
        onChangeText={ setPinValue }
        cellCount={ 4 }
        secureTextEntry
        keyboardType="number-pad"
        textContentType="password"
        renderCell={({ index, symbol, isFocused }) => {
          const inputSymbol = symbol ? "•" : "";

          return (
            <Text
              key={ index }
              style={[ styles.cell, isFocused && styles.focused ]}
              onLayout={ getCellOnLayoutHandler(index) }
            >
              { isFocused ? <Cursor/> : inputSymbol }
            </Text>
          );
        }
        }
      />
      { error &&
        <View style={ styles.errorTextContainer }>
          <Text style={ styles.errorText }>
            { strings.auth.incorrectPinCode }
          </Text>
        </View>
      }
      { renderActionButtons() }
    </Modal>
  );
};

export default PinInput;