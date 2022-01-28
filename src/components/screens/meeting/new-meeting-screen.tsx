import React from "react";
import { Meeting, MeetingType } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";
import MeetingNavigator from "../../../types/navigators/meeting";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MeetingLanguage } from "../../../types";
import { Button, Card, RadioButton } from "react-native-paper";
import strings from "../../../localization/strings";
import { KeyboardAvoidingView, Platform, View, Text, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../../../styles/screens/meeting/new-meeting-screen";
import theme from "../../../theme";
import moment from "moment";

/**
 * New meeting screen
 */
const NewMeetingScreen: React.FC = () => {
  const navigation = useNavigation<MeetingNavigator.NavigationProps>();
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const errorContext = React.useContext(ErrorContext);
  const { params } = useRoute<MeetingNavigator.RouteProps>();
  const meetingTime = params?.meetingTime;

  const [ newMeeting, setNewMeeting ] = React.useState<Meeting>({
    time: meetingTime?.startTime || new Date(),
    contact: {
      firstName: "",
      lastName: ""
    },
    participantCount: 0,
    type: MeetingType.Meeting,
    language: MeetingLanguage.FI
  });

  if (!meetingTime) {
    return null;
  }

  /**
   * Check is the meeting not valid
   */
  const isNewMeetingInvalid = () => !newMeeting.contact.firstName || !newMeeting.contact.lastName || !newMeeting.type || !newMeeting.participantCount;

  /**
   * Handler for new meeting change 
   *
   * @param name name of the input
   * @param value value of the input
   */
  const onNewMeetingChange = (name: string) => (value: string) => {
    const updatedNewMeeting: Meeting = { ...newMeeting, [name]: value };
    setNewMeeting(updatedNewMeeting);
  };

  /**
   * Handler for meeting contact change 
   *
   * @param name name of the input
   * @param value value of the input
   */
  const onNewMeetingContactChange = (name: string) => (value: string) => {
    const updatedNewMeeting: Meeting = { ...newMeeting, contact: { ...newMeeting.contact, [name]: value } };
    setNewMeeting(updatedNewMeeting);
  };

  /**
   * Handler for meeting cancel 
   */
  const onMeetingCancel = () => navigation.navigate("meetingTimes");

  /**
   * Handler for meeting create 
   */
  const onMeetingCreate = async () => {
    try {
      await meetingsApiContext.createMeeting({ meeting: newMeeting });
      setNewMeeting({
        time: meetingTime?.startTime || new Date(),
        contact: {
          firstName: "",
          lastName: ""
        },
        participantCount: 0,
        type: MeetingType.Meeting,
        language: MeetingLanguage.FI
      });
      navigation.navigate("meetingTimes");
    } catch (error) {
      errorContext.setError(strings.errorHandling.meeting.create, error);
    }
  };

  /**
   * Renders meeting time 
   */
  const renderMeetingTime = () => (
    <View style={ styles.meetingTime }>
      <Text style={ theme.fonts.medium }>
        { `${strings.meetings.newMeeting.selectedTime}:` }
      </Text>
      <Text style={ theme.fonts.medium }>
        { `${moment(meetingTime.startTime).format("DD.MM.YYYY")} ${strings.meetings.newMeeting.time} ${moment(meetingTime.startTime).format("hh:mm")}-${moment(meetingTime.endTime).format("hh:mm")}` }
      </Text>
    </View>
  );

  /**
   * Renders meeting contact edit 
   */
  const renderContactEdit = () => (
    <>
      <TextInput
        style={ styles.input }
        value={ newMeeting.contact.firstName }
        placeholder={ `${strings.meetings.newMeeting.contact.firstName}*` }
        onChangeText={ onNewMeetingContactChange("firstName") }
      />
      <TextInput
        style={ styles.input }
        value={ newMeeting.contact.lastName }
        placeholder={ `${strings.meetings.newMeeting.contact.lastName}*` }
        onChangeText={ onNewMeetingContactChange("lastName") }
      />
      <TextInput
        style={ styles.input }
        value={ newMeeting.contact.phone }
        placeholder={ strings.meetings.newMeeting.contact.phone }
        keyboardType="number-pad"
        onChangeText={ onNewMeetingContactChange("phone") }
      />
      <TextInput
        style={ styles.input }
        keyboardType="email-address"
        value={ newMeeting.contact.email }
        placeholder={ strings.meetings.newMeeting.contact.email }
        onChangeText={ onNewMeetingContactChange("email") }
      />
    </>
  );

  /**
   * Renders meeting language select 
   */
  const renderLanguageSelect = () => (
    <View>
      <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
        { strings.meetings.newMeeting.meetingLanguage }
      </Text>
      <RadioButton.Group onValueChange={ onNewMeetingChange("language") } value={ newMeeting.language }>
        <RadioButton.Item
          style={ styles.radioButtonText }
          color={ theme.colors.primary }
          label={ strings.languages.en }
          value={ MeetingLanguage.EN }
        />
        <RadioButton.Item
          style={ styles.radioButtonText }
          color={ theme.colors.primary }
          label={ strings.languages.fi }
          value={ MeetingLanguage.FI }
        />
      </RadioButton.Group>
    </View>
  );

  /**
   * Renders meeting type select 
   */
  const renderMeetingTypeSelect = () => (
    <View style={{ marginTop: theme.spacing(2) }}>
      <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
        { `${strings.meetings.newMeeting.meetingType.title}*` }
      </Text>
      <RadioButton.Group onValueChange={ onNewMeetingChange("type") } value={ newMeeting.type }>
        <RadioButton.Item
          style={ styles.radioButtonText }
          color={ theme.colors.primary }
          label={ strings.meetings.newMeeting.meetingType.phone }
          value={ MeetingType.Phone }
        />
        <RadioButton.Item
          style={ styles.radioButtonText }
          color={ theme.colors.primary }
          label={ strings.meetings.newMeeting.meetingType.meeting }
          value={ MeetingType.Meeting }
        />
      </RadioButton.Group>
    </View>
  );

  /**
   * Renders addtional info 
   */
  const renderAddtionalInfo = () => (
    <>
      <View style={{ marginTop: theme.spacing(2) }}>
        <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
          { `${strings.meetings.newMeeting.participantCount}*` }
        </Text>
        <TextInput
          style={ styles.input }
          placeholder={ `${strings.meetings.newMeeting.participantCount}*` }
          onChangeText={ onNewMeetingChange("participantCount") }
          keyboardType="numeric"
        />
      </View>
      <View style={{ marginTop: theme.spacing(2) }}>
        <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
          { strings.meetings.newMeeting.additionalInformation }
        </Text>
        <TextInput
          multiline
          textAlignVertical="top"
          numberOfLines={ 6 }
          style={ styles.multilineInput }
          placeholder={ strings.meetings.newMeeting.additionalInformation }
          onChangeText={ onNewMeetingChange("additionalInformation") }
        />
      </View>
    </>
  );

  /**
   * Renders buttons 
   */
  const renderButtons = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Button
        onPress={ onMeetingCancel }
        style={ styles.backButton }
      >
        { strings.generic.back }
      </Button>
      <Button
        disabled={ isNewMeetingInvalid() }
        onPress={ onMeetingCreate }
        style={ styles.reserveButton }
        color="white"
      >
        { strings.generic.reserve }
      </Button>
    </View>
  );

  /**
   * Component render 
   */
  return (
    <KeyboardAvoidingView behavior={ Platform.OS === "ios" ? "padding" : "height" }>
      <ScrollView>
        <View style={ styles.newMeeting }>
          <Card style={ styles.meetingCard }>
            { renderMeetingTime() }
          </Card>
          <Card style={ styles.meetingCard }>
            <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
              { strings.meetings.newMeeting.title }
            </Text>
            { renderContactEdit() }
          </Card>
          <Card style={ styles.meetingCard }>
            { renderLanguageSelect() }
            { renderMeetingTypeSelect() }
            { renderAddtionalInfo() }
          </Card>
          { renderButtons() }
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
};

export default NewMeetingScreen;