import moment from "moment";
import React from "react";
import { View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Card } from "react-native-paper";
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
import { useAppSelector } from "../../../app/hooks";
import { selectSelectedLanguage } from "../../../features/locale/locale-slice";

/**
 * Meeting times screen
 */
const MeetingTimesScreen: React.FC = () => {
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const navigation = useNavigation<MeetingNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);
  const selectedLanguage = useAppSelector(selectSelectedLanguage);

  const [ selectedStartDate, setSelectedStartDate ] = React.useState<Date | undefined>(new Date());
  const [ selectedEndDate, setSelectedEndDate ] = React.useState<Date | undefined>(new Date());
  const [ meetingTimes, setMeetingTimes ] = React.useState<MeetingTime[]>([]);

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
   * @param pickedDate picked date
   */
  const startDatePickerChange = (_: any, pickedDate?: Date) => {
    moment(pickedDate).isAfter(selectedEndDate) && setSelectedEndDate(undefined);
    setSelectedStartDate(pickedDate);
    setSelectedEndDate(pickedDate);
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
    <DateTimePicker
      value={ selectedStartDate || new Date() }
      mode="date"
      is24Hour
      display="default"
      onChange={ startDatePickerChange }
      minimumDate={ new Date() }
      style={{ width: 100, backgroundColor: "#fff" }}
      locale={ selectedLanguage }
    />
  );

  /**
   * Component render
   */
  return (
    <>
      <ScrollView>
        <View style={ styles.meetingTimes }>
          <Card style={ styles.meetingCard }>
            <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
              { strings.meetings.meetingTimes.bookTime }
            </Text>
            <Text>{ strings.meetings.meetingTimes.bookTimeDescription }</Text>
          </Card>

          <View style={{ marginTop: theme.spacing(2) }}>
            <Card style={ styles.meetingCard }>
              <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
                { strings.meetings.meetingTimes.datePicker.title }
              </Text>
              <View style={ styles.datePicker }>
                <Text>{ strings.meetings.meetingTimes.datePicker.startDate }</Text>
                { renderStartDatePicker() }
              </View>
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
    </>
  );
};

export default MeetingTimesScreen;