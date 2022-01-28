import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IOSMode } from "../../types";
import styles from "../../styles/generic/date-picker";
import { Button } from "react-native-paper";
import moment from "moment";

/**
 * Component properties
 */
interface Props {
  mode: IOSMode;
  date: Date;
  startDate?: Date;
  render?: () => React.ReactNode;
  onDateChange: (date: Date) => void;
}

/**
 * Date picker component
 *
 * @param props component properties
 */
const DatePicker: React.FC<Props> = ({
  date,
  startDate,
  mode,
  render,
  onDateChange
}) => {
  const [ open, setOpen ] = React.useState(false);

  /**
   * Handler for end date picker date change
   * 
   * @param pickedDate picked date
  */
  const onDatePickerChange = (_: any, pickedDate?: Date) => {
    setOpen(Platform.OS === "ios");
    pickedDate && onDateChange(pickedDate);
    setOpen(false);
  };

  /**
   * Renders start date picker dialog
   */
  const renderDatePicker = () => (
    <>
      {
        Platform.OS === "android" && open && <DateTimePicker
          is24Hour
          value={ date }
          display="default"
          onChange={ onDatePickerChange }
          minimumDate={ startDate }
          onTouchCancel={ () => setOpen(false) }
        />
      }
      {
        Platform.OS === "ios" && open &&
        <Modal
          transparent
          animationType="fade"
        >
          <View style={ styles.modalView }>
            <View style={ styles.datePickerIos }>
              <DateTimePicker
                value={ date }
                mode={ mode }
                themeVariant="light"
                display="inline"
                onChange={ onDatePickerChange }
                minimumDate={ startDate }
                style={{ margin: 20 }}
                onTouchCancel={ () => setOpen(false) }
              />
            </View>
          </View>
        </Modal>
      }
    </>
  );

  /**
   * Render default
  */
  const renderDefault = () => (
    <Button
      color="white"
      style={ styles.selectedMeetingTime }
      
    >
      { moment(date).format("DD/MM/YYYY") }
    </Button>
  );

  /**
   * Component render
   */
  return (
    <View>
      <TouchableOpacity onPress={ () => setOpen(true) }>
        {
          render ?
            render() :
            renderDefault()
        }
      </TouchableOpacity>
      { renderDatePicker() }
    </View>
  );
};

export default DatePicker;