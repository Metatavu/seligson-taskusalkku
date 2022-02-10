import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import styles from "../../styles/generic/fund-chart";
import strings from "../../localization/strings";
import { ChartRange } from "../../types";
import moment from "moment";
import DatePicker from "./date-picker";
import theme from "../../theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * Component properties
 */
interface Props {
  selectedRange: Date[] | ChartRange;
  loading?: boolean;
  onDateRangeChange: (newRange: Date[] | ChartRange) => void;
}

/**
 * Chart range selector component
 *
 * @param props component properties
 */
const ChartRangeSelector: React.FC<Props> = ({ selectedRange, loading, onDateRangeChange }) => {
  const [ showDateInputs, setShowDateInputs ] = React.useState(false);
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
  const onDateChange = (date: Date) => {
    settingStartDate ? setStartDate(date) : setEndDate(date);
  };

  /**
   * Event handler for close date selection
   */
  const onCloseDateSelection = () => {
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
        disabled={ loading }
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
   * Renders date picker
   */
  const renderDatePicker = () => {
    const maxDate = settingStartDate ? moment(endDate).toDate() : new Date();
    const minimumDate = settingStartDate ? undefined : moment(startDate).toDate();

    return (
      <View style={{ flexDirection: "row" }}>
        <DatePicker
          key="startDate"
          date={ startDate }
          mode="date"
          onDateChange={ onDateChange }
          onOpen={ () => setSettingStartDate(true) }
          customStyles={ styles.datePickerButton }
          maxDate={ maxDate }
          minimumDate={ minimumDate }
        />
        <View style={{ justifyContent: "center" }}>
          <Text style={{ color: theme.colors.primary, marginRight: theme.spacing(1) }}>
            -
          </Text>
        </View>
        <DatePicker
          key="endDate"
          date={ endDate }
          mode="date"
          onDateChange={ onDateChange }
          onOpen={ () => setSettingStartDate(false) }
          customStyles={ styles.datePickerButton }
          maxDate={ maxDate }
          minimumDate={ minimumDate }
        />
      </View>
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
          <Icon
            name="calendar"
            color={ theme.colors.primary }
            size={ 16 }
            style={ styles.iconButton }
            onPress={ () => setShowDateInputs(true) }
          />
        </View>
      );
    }

    return (
      <View style={ styles.dateRangeButtonRow }>
        { renderDatePicker() }
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
          <Icon
            name="check"
            color={ theme.colors.primary }
            size={ 16 }
            onPress={ onConfirmDates }
            style={ styles.iconButton }
          />
          <Icon
            name="close"
            color={ theme.colors.primary }
            size={ 16 }
            onPress={ onCloseDateSelection }
            style={ styles.iconButton }
          />
        </View>
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <>
      { renderRangeSelection() }
    </>
  );
};

export default ChartRangeSelector;