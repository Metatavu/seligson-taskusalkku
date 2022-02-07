import moment from "moment";
import React from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
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
import DatePicker from "../../generic/date-picker";

/**
 * Meeting times screen
 */
const MeetingTimesScreen: React.FC = () => {
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const navigation = useNavigation<MeetingNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);

  const [ loading, setLoading ] = React.useState(true);
  const [ selectedDate, setSelectedSDate ] = React.useState<Date>(moment().add(1, "day").toDate());
  const [ meetingTimes, setMeetingTimes ] = React.useState<MeetingTime[]>([]);

  /**
   * Fetches meeting times
   */
  const fetchMeetingTimes = async () => {
    setLoading(true);

    try {
      if (!selectedDate) {
        return;
      }

      setMeetingTimes(await meetingsApiContext.listMeetingTimes({
        startDate: selectedDate,
        endDate: selectedDate
      }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.meetingTimes.list, error);
    }

    setLoading(false);
  };

  /**
   * Effect for fetching meeting times when selected start or end date changes
   */
  React.useEffect(() => {
    fetchMeetingTimes();
  }, [ selectedDate ]);

  /**
   * Handler for start date picker date change
   * 
   * @param pickedDate picked date
   */
  const datePickerChange = (pickedDate: Date) => {
    moment(pickedDate).isAfter(selectedDate) && setSelectedSDate(pickedDate);
    setSelectedSDate(pickedDate);
    setSelectedSDate(pickedDate);
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
      <Text>{ moment.utc(meetingTime.startTime).format("HH:mm") }</Text>
    </Button>
  );

  /**
   * Renders content
   */
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={ theme.colors.primary }/>;
    }

    return (
      <Card style={ styles.meetingCard }>
        <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
          { strings.meetings.meetingTimes.datePicker.title }
        </Text>
        { Platform.OS === "android" &&
          <DatePicker
            mode="date"
            date={ selectedDate }
            startDate={ new Date() }
            onDateChange={ datePickerChange }
            minimumDate={ moment().add(1, "day").toDate() }
          />
        }
        { Platform.OS === "ios" &&
          <DatePicker
            mode="date"
            date={ selectedDate }
            startDate={ new Date() }
            onDateChange={ datePickerChange }
            minimumDate={ moment().add(1, "day").toDate() }
          />
        }
        { meetingTimes.length <= 0 &&
          <Text style={ styles.noAvailableTime }>
            { strings.meetings.newMeeting.noAvailableTime }
          </Text>
        }
        <FlatGrid
          itemDimension={ 130 }
          data={ meetingTimes }
          renderItem={ ({ item, index }) => renderMeetingTime(item, index)}
        />
      </Card>
    );
  };

  /**
   * Component render
   */
  return (
    <ScrollView>
      <View style={ styles.meetingTimes }>
        <Card style={ styles.meetingCard }>
          <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
            { strings.meetings.meetingTimes.bookTime }
          </Text>
          <Text>
            { strings.meetings.meetingTimes.bookTimeDescription }
          </Text>
        </Card>
        <View style={{ marginTop: theme.spacing(2) }}>
          { renderContent() }
        </View>
      </View>
    </ScrollView>
  );
};

export default MeetingTimesScreen;