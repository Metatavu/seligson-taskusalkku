import moment from "moment";
import React from "react";
import { Platform, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Card, Divider, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import { useAppSelector } from "../../../app/hooks";
import { selectAnonymousAuth, selectAuth } from "../../../features/auth/auth-slice";
import Api from "../../../api/api";
import { MeetingTime } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";

/**
 * Meetings screen
 */
const MeetingsScreen: React.FC = () => {
  const auth = useAppSelector(selectAuth);
  const anonymousAuth = useAppSelector(selectAnonymousAuth);
  const [ selectedDate, setSelectedDate ] = React.useState<Date>()
  const [ meetingTimes, setMeetingTimes ] = React.useState<MeetingTime[]>([])
  const [ datePickerOpen, setDatePickerOpen ] = React.useState(false)
  const meetingsApiContext = React.useContext(MeetingsApiContext);

  /**
   * Handler for date picker date change
   */
  const fetchMeetingTimes = async () => {
    try {
      if (!anonymousAuth) {
        throw new Error("No access token");
      }
      setMeetingTimes(await meetingsApiContext.listMeetingTimes({
        startDate: selectedDate,
        endDate: moment(selectedDate).add(1, "day").toDate()
      }));
    } catch (error) {
      // TODO error handling
    }
  }

  React.useEffect(() => {
    fetchMeetingTimes()
  }, [selectedDate])

  /**
   * Handler for date picker date change
   */
  const datePickerChange = (e: any, pickedDate?: Date) => {
    setDatePickerOpen(Platform.OS === 'ios');
    setSelectedDate(pickedDate);
  }

  /**
   * Renders date picker dialog
   */
  const renderDatePicker = () => (
    datePickerOpen && <DateTimePicker
      value={ selectedDate || new Date() }
      mode="date"
      is24Hour={true}
      display="default"
      onChange={ datePickerChange }
      minimumDate={ new Date() }
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
            <Button onPress={ () => setDatePickerOpen(true) }>
              { moment(selectedDate).format("DD/MM/YYYY") }
            </Button>
          <Divider/>
          { meetingTimes.map(meetingTime => meetingTime) }
        </Card>
      </View>
      { renderDatePicker() }
    </>
  );
};

export default MeetingsScreen;