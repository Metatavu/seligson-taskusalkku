import moment from "moment";
import React from "react";
import { Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Card, Divider, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import { MeetingTime } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";
import MeetingNavigator from "../../../types/navigators/meeting";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../../../styles/screens/meeting/meeting-times-screen";
import theme from "../../../theme";
import { FlatGrid } from "react-native-super-grid";

/**
 * Meeting times screen
 */
const MeetingTimesScreen: React.FC = () => {
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const navigation = useNavigation<MeetingNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);

  const [ selectedStartDate, setSelectedStartDate ] = React.useState<Date>();
  const [ selectedEndDate, setSelectedEndDate ] = React.useState<Date>();
  const [ meetingTimes, setMeetingTimes ] = React.useState<MeetingTime[]>([]);
  const [ startDatePickerOpen, setStartDatePickerOpen ] = React.useState(false);
  const [ endDatePickerOpen, setEndDatePickerOpen ] = React.useState(false);

  /**
   * Fetches meeting times
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
      errorContext.setError(strings.errorHandling.meetingTimes.list, error);
    }
  };

  /**
   * Effect for fetching meeting times when selected start or end date changes
   */
  React.useEffect(() => {
    fetchMeetingTimes();
  }, [ selectedStartDate, selectedEndDate ]);

  /**
   * Handler for start date picker date change
   * 
   * @param e date picker change event
   * @param pickedDate picked date
   */
  const startDatePickerChange = (e: any, pickedDate?: Date) => {
    setStartDatePickerOpen(Platform.OS === "ios");
    moment(pickedDate).isAfter(selectedEndDate) && setSelectedEndDate(undefined);
    setSelectedStartDate(pickedDate);
    setStartDatePickerOpen(false);
  };

  /**
   * Handler for end date picker date change
   * 
   * @param e date picker change event
   * @param pickedDate picked date
   */
  const endDatePickerChange = (e: any, pickedDate?: Date) => {
    setEndDatePickerOpen(Platform.OS === "ios");
    setSelectedEndDate(pickedDate);
    setEndDatePickerOpen(false);
  };

  /**
   * Renders meeting time entries
   *
   * @param meetingTime meeting time
   * @param index index of the meeting time
   */
  const renderMeetingTime = (meetingTime: MeetingTime, index: number) => (
    <Button
      key={ index }
      style={ styles.meetingTime }
      onPress={ () => navigation.navigate("newMeeting", { meetingTime: meetingTime }) }
    >
      <Text>{ moment(meetingTime.startTime).format("DD/MM HH:mm") }</Text>
    </Button>
  );

  /**
   * Renders start date picker dialog
   */
  const renderStartDatePicker = () => (
    startDatePickerOpen && <DateTimePicker
      value={ selectedStartDate || new Date() }
      mode="date"
      is24Hour
      display="default"
      onChange={ startDatePickerChange }
      minimumDate={ new Date() }
      onTouchCancel={ () => setStartDatePickerOpen(false) }
    />
  );

  /**
   * Renders end date picker dialog
   */
  const renderEndDatePicker = () => (
    endDatePickerOpen && <DateTimePicker
      value={ selectedEndDate || new Date() }
      mode="date"
      is24Hour
      display="default"
      onChange={ endDatePickerChange }
      minimumDate={ selectedStartDate }
      onTouchCancel={ () => setEndDatePickerOpen(false) }
    />
  );

  /**
   * Component render
   */
  return (
    <>
      <ScrollView>
        <View style={ styles.meetingTimes }>
          <Text style={ theme.fonts.medium }>{ strings.meetings.meetingTimes.bookTime }</Text>
          <Card style={ styles.meetingCard }>
            <Text>{ strings.meetings.meetingTimes.bookTimeDescription }</Text>
          </Card>
          <View style={{ marginTop: theme.spacing(2) }}>
            <Text style={ theme.fonts.medium}>
              { strings.meetings.meetingTimes.datePicker.title }
            </Text>
            <Card style={ styles.meetingCard }>
              <View style={ styles.datePicker }>
                <Text>{ strings.meetings.meetingTimes.datePicker.startDate }</Text>
                <Button
                  style={ styles.datePickerButton }
                  onPress={ () => setStartDatePickerOpen(true) }
                >
                  { moment(selectedStartDate).format("DD/MM/YYYY") }
                </Button>
              </View>
              <View style={ styles.datePicker }>
                <Text>{ strings.meetings.meetingTimes.datePicker.endDate }</Text>
                <Button
                  style={ styles.datePickerButton }
                  onPress={ () => setEndDatePickerOpen(true) }
                >
                  { moment(selectedEndDate).format("DD/MM/YYYY") }
                </Button>
              </View>
              <Divider/>
              <FlatGrid
                style={{ marginTop: theme.spacing(1) }}
                itemDimension={ 130 }
                data={ meetingTimes }
                renderItem={ ({ item, index }) => renderMeetingTime(item, index)}
              />
            </Card>
          </View>
        </View>
      </ScrollView>
      { renderStartDatePicker() }
      { renderEndDatePicker() }
    </>
  );
};

export default MeetingTimesScreen;