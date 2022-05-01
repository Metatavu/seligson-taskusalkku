import React from "react";
import { Meeting, MeetingType } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";
import MeetingNavigator from "../../../types/navigators/meeting";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MeetingLanguage } from "../../../types";
import { Button, Card, RadioButton } from "react-native-paper";
import strings from "../../../localization/strings";
import { View, Text, TextInput } from "react-native";
import styles from "../../../styles/screens/meeting/new-meeting-screen";
import theme from "../../../theme";
import moment from "moment";
import { useHardwareGoBack } from "../../../app/hooks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";

/**
 * New meeting screen
 */
const NewMeetingScreen: React.FC = () => {
  useHardwareGoBack();
  const navigation = useNavigation<MeetingNavigator.NavigationProps>();
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const errorContext = React.useContext(ErrorContext);
  const { meetingTime } = useRoute<MeetingNavigator.RouteProps<"newMeeting">>().params;

  const [ newMeeting, setNewMeeting ] = React.useState<Meeting>({
    time: meetingTime.startTime,
    contact: {
      firstName: "",
      lastName: ""
    },
    participantCount: 0,
    type: MeetingType.Meeting,
    language: MeetingLanguage.FI
  });

  /**
   * Checks whether email is valid or not
   *
   * @param email email to validate
   */
  const isValidEmail = (email: string) => (
    !!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  );

  /**
   * Check is the meeting not valid
   */
  const isNewMeetingInvalid = () => {
    const { contact, type, participantCount } = newMeeting;
    const { firstName, lastName, email } = contact;

    return (
      !firstName ||
      !lastName ||
      !type ||
      !participantCount ||
      (!!email && !isValidEmail(email))
    );
  };

  /**
   * Handler for new meeting change
   *
   * @param name name of the input
   */
  const onNewMeetingChange = (name: string) => (value: string) => {
    const updatedNewMeeting: Meeting = { ...newMeeting, [name]: value };
    setNewMeeting(updatedNewMeeting);
  };

  /**
   * Handler for meeting contact change
   *
   * @param name name of the input
   */
  const onNewMeetingContactChange = (name: string) => (value: string) => {
    setNewMeeting({ ...newMeeting, contact: { ...newMeeting.contact, [name]: value } });
  };

  /**
   * Handler for meeting cancel
   */
  const onMeetingCancel = () => navigation.navigate("meetingTimes");

  /**
   * Creates meeting
   *
   * @param meeting meeting
   */
  const createMeeting = async (meeting: Meeting) => {
    try {
      await meetingsApiContext.createMeeting({ meeting: meeting });

      setNewMeeting({
        time: meetingTime.startTime,
        contact: {
          firstName: "",
          lastName: ""
        },
        participantCount: 0,
        type: MeetingType.Meeting,
        language: MeetingLanguage.FI
      });

      navigation.navigate("meetingTimes", { createdMeeting: meeting });
    } catch (error) {
      errorContext.setError(strings.errorHandling.meeting.create, error);
    }
  };

  /**
   * Renders meeting time
   */
  const renderMeetingTime = () => {
    const { startTime, endTime } = meetingTime;
    const startDisplayDate = moment(startTime).format("DD.MM.YYYY");
    const startDisplayTime = moment(startTime).format("HH:mm");
    const endDisplayTime = moment(endTime).format("HH:mm");

    return (
      <View style={ styles.meetingTime }>
        <Text style={ theme.fonts.medium }>
          { `${strings.meetings.newMeeting.selectedTime}:` }
        </Text>
        <Text style={ theme.fonts.medium }>
          { `${startDisplayDate} ${startDisplayTime}-${endDisplayTime}` }
        </Text>
      </View>
    );
  };

  /**
   * Renders meeting contact edit
   */
  const renderContactEdit = () => {
    const emailPresent = !!newMeeting.contact.email;
    const emailValid = newMeeting.contact.email && isValidEmail(newMeeting.contact.email);
    const emailInputOptionalStyles = emailValid ?
      { borderColor: theme.colors.success } :
      { borderColor: theme.colors.error };

    return (
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
        <View style={{ position: "relative" }}>
          <TextInput
            style={[ styles.input, emailPresent && emailInputOptionalStyles ]}
            keyboardType="email-address"
            value={ newMeeting.contact.email }
            placeholder={ strings.meetings.newMeeting.contact.email }
            onChangeText={ onNewMeetingContactChange("email") }
          />
          { emailPresent &&
            <View style={ styles.emailValidIcon }>
              <Icon
                name={ emailValid ? "check" : "times" }
                color={ emailValid ? theme.colors.success : theme.colors.error }
                size={ 24 }
              />
            </View>
          }
        </View>
      </>
    );
  };

  /**
   * Renders meeting language select
   */
  const renderLanguageSelect = () => (
    <View>
      <Text style={[ theme.fonts.medium, styles.meetingTitle ]}>
        { strings.meetings.newMeeting.meetingLanguage }
      </Text>
      <RadioButton.Group
        onValueChange={ onNewMeetingChange("language") }
        value={ newMeeting.language }
      >
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
      <RadioButton.Group
        onValueChange={ onNewMeetingChange("type") }
        value={ newMeeting.type }
      >
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
   * Renders additional info
   */
  const renderAdditionalInfo = () => (
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
        onPress={ () => createMeeting(newMeeting) }
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
    <KeyboardAwareScrollView>
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
          { renderAdditionalInfo() }
        </Card>
        { renderButtons() }
      </View>
    </KeyboardAwareScrollView>
  );
};

export default NewMeetingScreen;