import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, StyleProp, Text, TextStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import { IOSMode } from "../../types";

/**
 * Component properties
 */
interface Props {
  mode: IOSMode;
  date: Date;
  startDate?: Date;
  style?: StyleProp<TextStyle>;
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
  style,
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
    open && <DateTimePicker
      is24Hour
      value={ date }
      mode={ mode }
      display="default"
      onChange={ onDatePickerChange }
      minimumDate={ startDate }
      onTouchCancel={ () => setOpen(false) }
    />
  );

  /**
   * Render default
  */
  const renderDefault = () => (
    <Text style={ style }>
      { moment(date).format("DD/MM/YYYY") }
    </Text>
  );

  /**
   * Component render
   */
  return (
    <>
      <TouchableOpacity onPress={ () => setOpen(true) }>
        {
          render ?
            render() :
            renderDefault()
        }
      </TouchableOpacity>
      { renderDatePicker() }
    </>
  );
};

export default DatePicker;