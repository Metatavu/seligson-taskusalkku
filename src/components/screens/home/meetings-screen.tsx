import moment from "moment";
import React from "react";
import { Platform, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Card, Divider, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import { MeetingTime } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";

/**
 * Meetings screen
 */
const MeetingsScreen: React.FC = () => {
  const [ selectedStartDate, setSelectedStartDate ] = React.useState<Date>();
  const [ selectedEndDate, setSelectedEndDate ] = React.useState<Date>();
  const [ meetingTimes, setMeetingTimes ] = React.useState<MeetingTime[]>([]);
  const [ startDatePickerOpen, setStartDatePickerOpen ] = React.useState(false);
  const [ endDatePickerOpen, setEndDatePickerOpen ] = React.useState(false);
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const errorContext = React.useContext(ErrorContext);

  /**
   * Handler for date picker range change
   */
  const fetchMeetingTimes = async () => {
    try {
      if (!selectedStartDate || !selectedEndDate) {
        return;
      }
      setMeetingTimes(await meetingsApiContext.listMeetingTimes({
        startDate: selectedStartDate,
        endDate: selectedEndDate
      }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.meetingTimes.list, error)
    }
  }

  React.useEffect(() => {
    fetchMeetingTimes()
  }, [selectedStartDate, selectedEndDate])

  /**
   * Handler for start date picker date change
   */
  const startDatePickerChange = (e: any, pickedDate?: Date) => {
    setStartDatePickerOpen(Platform.OS === 'ios');
    setSelectedEndDate(undefined);
    setSelectedStartDate(pickedDate);
  }

  /**
   * Handler for end date picker date change
   */
  const endDatePickerChange = (e: any, pickedDate?: Date) => {
    setEndDatePickerOpen(Platform.OS === 'ios');
    setSelectedEndDate(pickedDate);
  }

  /**
   * Renders meeting time entries
   */
  const renderMeetingTime = (meetingTime: MeetingTime) => (
    <View>
      <Text>{ moment(meetingTime.startTime).format("DD/MM HH:mm") }</Text>
    </View>
  )

  /**
   * Renders start date picker dialog
   */
  const renderStartDatePicker = () => (
    startDatePickerOpen && <DateTimePicker
      value={ selectedStartDate || new Date() }
      mode="date"
      is24Hour={true}
      display="default"
      onChange={ startDatePickerChange }
      minimumDate={ new Date() }
    />
  )


  /**
   * Renders end date picker dialog
   */
  const renderEndDatePicker = () => (
    endDatePickerOpen && <DateTimePicker
      value={ selectedEndDate || new Date() }
      mode="date"
      is24Hour={true}
      display="default"
      onChange={ endDatePickerChange }
      minimumDate={ selectedStartDate }
    />
  )

  /**
   * Component render
   */
  return (
    <>
      <View>
        <Text>{ strings.meetings.bookTime }</Text>
        <Card>
          <Text>{ strings.meetings.bookTimeDescription }</Text>
        </Card>
        <Text>{ strings.meetings.datePicker.title }</Text>
          <Card>
            <Text>{ strings.meetings.bookTime }</Text>
            <Button onPress={ () => setStartDatePickerOpen(true) }>
              { moment(selectedStartDate).format("DD/MM/YYYY") }
            </Button>
            <Text>{ strings.meetings.bookTime }</Text>
            <Button onPress={ () => setEndDatePickerOpen(true) }>
              { moment(selectedEndDate).format("DD/MM/YYYY") }
            </Button>
          <Divider/>
          { meetingTimes.map(renderMeetingTime) }
        </Card>
      </View>
      { renderStartDatePicker() }
      { renderEndDatePicker() }
    </>
  );
};

export default MeetingsScreen;