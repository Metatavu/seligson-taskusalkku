import moment from "moment";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Button, Card, Dialog, Paragraph, Portal } from "react-native-paper";
import strings from "../../../localization/strings";
import { MeetingTime } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";
import MeetingNavigator from "../../../types/navigators/meeting";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../../../styles/screens/meeting/meeting-times-screen";
import theme from "../../../theme";
import DatePicker from "../../generic/date-picker";
import { useHardwareGoBack } from "../../../app/hooks";

/**
 * Meeting times screen
 */
const MeetingTimesScreen: React.FC = () => {
  useHardwareGoBack();
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const navigation = useNavigation<MeetingNavigator.NavigationProps<"meetingTimes">>();
  const { createdMeeting } = useRoute<MeetingNavigator.RouteProps<"meetingTimes">>().params || {};
  const errorContext = React.useContext(ErrorContext);

  const [ loading, setLoading ] = React.useState(true);
  const [ selectedDate, setSelectedSDate ] = React.useState<Date>(moment().add(1, "day").toDate());
  const [ meetingTimes, setMeetingTimes ] = React.useState<MeetingTime[]>([]);
  const [ meetingNotificationVisible, setMeetingNotificationVisible ] = React.useState(false);

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
   * Effect that opens created meeting notification modal if meeting was created
   */
  React.useEffect(() => setMeetingNotificationVisible(!!createdMeeting), [ createdMeeting ]);

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
      <Text>{ moment(meetingTime.startTime).format("HH:mm") }</Text>
    </Button>
  );

  /**
   * Renders meeting times
   */
  const renderMeetingTimes = () => {
    if (!meetingTimes.length) {
      return (
        <Text style={ styles.noAvailableTime }>
          { strings.meetings.newMeeting.noAvailableTime }
        </Text>
      );
    }

    const items = [ ...meetingTimes ];
    const rows: React.ReactNode[] = [];

    while (items.length) {
      rows.push(
        <View key={ rows.length } style={ styles.meetingTimeRow }>
          { items.splice(0, 2).map(renderMeetingTime) }
        </View>
      );
    }

    return rows;
  };

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
        <DatePicker
          mode="date"
          date={ selectedDate }
          startDate={ new Date() }
          onDateChange={ datePickerChange }
          minimumDate={ moment().add(1, "day").toDate() }
        />
        <View style={{ paddingTop: theme.spacing(2) }}>
          { renderMeetingTimes() }
        </View>
      </Card>
    );
  };

  /**
   * Renders dialog meeting time
   *
   * @param label label
   * @param meetingTime meeting time
   */
  const renderDialogMeetingTime = (label: string, meetingTime: Date) => (
    <>
      <Paragraph style={ styles.dialogMeetingTimeLabel }>
        { label }
      </Paragraph>
      <Paragraph style={{ marginBottom: theme.spacing(2) }}>
        { moment(meetingTime).format("DD.MM.YYYY HH.mm") }
      </Paragraph>
    </>
  );

  /**
   * Renders modal info text
   *
   * @param text text
   */
  const renderModalInfoText = (text: string) => (
    <Paragraph style={ styles.dialogParagraph }>
      { text }
    </Paragraph>
  );

  /**
   * Renders meeting created modal if meeting was created before navigating to this screen
   */
  const renderMeetingCreatedModal = () => {
    const localized = strings.meetings.meetingTimes.meetingCreatedDialog;

    return (
      <Portal>
        <Dialog
          visible={ meetingNotificationVisible }
          dismissable={ false }
        >
          <Dialog.Title style={ styles.dialogTitle }>
            { localized.title }
          </Dialog.Title>
          <Dialog.Content>
            { createdMeeting?.time &&
              renderDialogMeetingTime(localized.date, createdMeeting.time)
            }
            { [ localized.info1, localized.info2, localized.info3 ].map(renderModalInfoText) }
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              uppercase={ false }
              labelStyle={{ color: "white" }}
              contentStyle={{ paddingHorizontal: theme.spacing(2) }}
              onPress={ () => setMeetingNotificationVisible(false) }
            >
              { strings.generic.okay }
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  /**
   * Component render
   */
  return (
    <ScrollView>
      { createdMeeting && renderMeetingCreatedModal() }
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