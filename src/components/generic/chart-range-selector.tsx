import React from "react";
import { View } from "react-native";
import { Button, IconButton } from "react-native-paper";
import styles from "../../styles/generic/fund-chart";
import strings from "../../localization/strings";
import { ChartRange, DatePickerEvent } from "../../types";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

/**
 * Component properties
 */
interface Props {
  selectedRange: Date[] | ChartRange;
  onDateRangeChange: (newRange: Date[] | ChartRange) => void;
}

/**
 * Chart range selector component
 *
 * @param props component properties
 */
const ChartRangeSelector: React.FC<Props> = ({ selectedRange, onDateRangeChange }) => {
  const [ showDateInputs, setShowDateInputs ] = React.useState(false);
  const [ datePickerOpen, setDatePickerOpen ] = React.useState(false);
  const [ settingStartDate, setSettingStartDate ] = React.useState(true);
  const [ startDate, setStartDate ] = React.useState<Date>(moment().subtract(1, "month").toDate());
  const [ endDate, setEndDate ] = React.useState<Date>(new Date());

  /**
   * Event handler for range change
   *
   * @param range selected range
   */
  const onRangeChange = (range: ChartRange) => () => onDateRangeChange(range);

  /**
   * Event handler for date picker change event
   *
   * @param dateValue date value from date picker
   */
  const onDateChange = (dateValue: any) => {
    const value = dateValue as DatePickerEvent;

    const { type, nativeEvent } = value;

    setDatePickerOpen(false);

    if (type === "dismissed") {
      return;
    }
    const date = moment(nativeEvent.timestamp).toDate();
    settingStartDate ? setStartDate(date) : setEndDate(date);
  };

  /**
   * Event handler for close date selection
   */
  const onCloseDateSelection = () => {
    setDatePickerOpen(false);
    setShowDateInputs(false);
  };

  /**
   * Event handler for on confirm dates click
   */
  const onConfirmDates = () => {
    onDateRangeChange([ startDate, endDate ]);
    onCloseDateSelection();
  };

  /**
   * Date range button
   *
   * @param range chart range
   * @param title display title
   */
  const renderDateRangeButton = (range: ChartRange, title: string) => {
    const selected = selectedRange === range;

    return (
      <Button
        mode="outlined"
        uppercase={ false }
        compact
        onPress={ onRangeChange(range) }
        style={[ styles.dateRangeButton, selected && styles.dateRangeButtonSelected ]}
        labelStyle={[ styles.dateRangeButtonText, selected && styles.dateRangeButtonTextSelected ]}
        color="white"
      >
        { title }
      </Button>
    );
  };

  /**
   * Render range selection
   */
  const renderRangeSelection = () => {
    if (!showDateInputs) {
      return (
        <View style={ styles.dateRangeButtonRow }>
          { renderDateRangeButton(ChartRange.MONTH, strings.fundCard.historyOneMonth) }
          { renderDateRangeButton(ChartRange.YEAR, strings.fundCard.historyOneYear) }
          { renderDateRangeButton(ChartRange.THREE_YEARS, strings.fundCard.historyThreeYears) }
          { renderDateRangeButton(ChartRange.FIVE_YEARS, strings.fundCard.historyFiveYears) }
          { renderDateRangeButton(ChartRange.TEN_YEARS, strings.fundCard.historyTenYears) }
          { renderDateRangeButton(ChartRange.MAX, strings.fundCard.historyMax) }
          <IconButton
            icon="calendar"
            color="#fff"
            style={{ maxWidth: 25 }}
            onPress={ () => setShowDateInputs(true) }
          />
        </View>
      );
    }

    return (
      <View>
        {/* TODO: Add proper styling to for date selection */}
        <Button
          onPress={() => {
            setDatePickerOpen(true);
            setSettingStartDate(true);
          }}
        >
          { startDate && moment(startDate).format("DD.MM.YYYY") }
        </Button>
        <Button
          onPress={ () => {
            setDatePickerOpen(true);
            setSettingStartDate(false);
          }}
        >
          { moment(endDate).format("DD.MM.YYYY") }
        </Button>
        <Button onPress={ onConfirmDates }>
          { strings.generic.ok }
        </Button>
        <Button onPress={ onCloseDateSelection }>
          { strings.generic.cancel }
        </Button>
      </View>
    );
  };

  /**
   * Renders date picker
   */
  const renderDatePicker = () => {
    if (!datePickerOpen) {
      return;
    }

    return (
      <DateTimePicker
        key="dateTimePicker"
        value={ settingStartDate ? startDate : endDate }
        mode="date"
        is24Hour
        display="default"
        onChange={ onDateChange }
        maximumDate={ settingStartDate ? endDate : new Date() }
        minimumDate={ settingStartDate ? undefined : startDate }
      />
    );
  };

  /**
   * Component render
   */
  return (
    <>
      { renderRangeSelection() }
      { renderDatePicker() }
    </>
  );
};

export default ChartRangeSelector;