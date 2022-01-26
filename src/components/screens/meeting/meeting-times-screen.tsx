import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Button, Card, Divider, Text, useTheme } from "react-native-paper";
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
import DatePicker from "../../generic/date-picker";

/**
 * Meeting times screen
 */
const MeetingTimesScreen: React.FC = () => {
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const navigation = useNavigation<MeetingNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);
  const { colors } = useTheme();

  const [ selectedStartDate, setSelectedStartDate ] = React.useState<Date>(new Date());
  const [ selectedEndDate, setSelectedEndDate ] = React.useState<Date>(new Date());
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
  const startDatePickerChange = (pickedDate: Date) => {
    moment(pickedDate).isAfter(selectedEndDate) && setSelectedEndDate(pickedDate);
    setSelectedStartDate(pickedDate);
  };

  /**
   * Handler for end date picker date change
   * 
   * @param pickedDate picked date
   */
  const endDatePickerChange = (pickedDate: Date) => {
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
   * Component render
   */
  return (
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
              <DatePicker
                date={ selectedStartDate }
                onDateChange={ startDatePickerChange }
                style={{ color: colors.primary }}
              />
            </View>
            <View style={ styles.datePicker }>
              <Text>{ strings.meetings.meetingTimes.datePicker.endDate }</Text>
              <DatePicker
                date={ selectedEndDate }
                onDateChange={ endDatePickerChange }
                style={{ color: colors.primary }}
              />
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
  );
};

export default MeetingTimesScreen;