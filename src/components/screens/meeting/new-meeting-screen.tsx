import React from "react";
import { Meeting, MeetingType } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";
import MeetingNavigator from "../../../types/navigators/meeting";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MeetingLanguage } from "../../../types";
import { Button, Card, TextInput } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/funds/funds-details-screen";
import { View } from "react-native";
import { Text } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

/**
 * Meetings screen
 */
const NewMeetingScreen: React.FC = () => {
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const navigation = useNavigation<MeetingNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);
  const { params } = useRoute<MeetingNavigator.RouteProps>();
  const meetingTIme = params?.meetingTime;

  const [ languageDropDown, setLanguageDropDown ] = React.useState(false)
  const [ meetingTypeDropDown, setMeetingTypeDropDown ] = React.useState(false)
  const [ newMeeting, setNewMeeting ] = React.useState<Meeting>({
    time: meetingTIme?.startTime || new Date(),
    contact: {
      firstName: "",
      lastName: ""
    },
    participantCount: 0,
    type: MeetingType.Meeting,
    language: MeetingLanguage.FI
  });

  if (!meetingTIme) {
    return null;
  }

  /**
   * Handler for meeting change 
   *
   * @param name name of the input
   * @param value value of the input
   */
  const onNewMeetingChange = (name: string) => (value: string) => {
    const updatedNewMeeting: Meeting = { ...newMeeting, [name]: value }
    setNewMeeting(updatedNewMeeting);
  }

  /**
   * Handler for meeting contact change 
   *
   * @param name name of the input
   * @param value value of the input
   */
  const onNewMeetingContactChange = (name: string) => (value: string) => {
    const updatedNewMeeting: Meeting = { ...newMeeting, contact: { ...newMeeting.contact, [name]: value } }
    setNewMeeting(updatedNewMeeting);
  }

  /**
   * Handler for meeting cancel 
   */
  const onMeetingCancel = () => {
    navigation.navigate("meetingTimes");
  }

  /**
   * Handler for meeting create 
   */
  const onMeetingCreate = async () => {
    try {
      await meetingsApiContext.createMeeting({ meeting: newMeeting });
      setNewMeeting({
          time: meetingTIme?.startTime || new Date(),
          contact: {
            firstName: "",
            lastName: ""
          },
          participantCount: 0,
          type: MeetingType.Meeting,
          language: MeetingLanguage.FI
        }
      )
      navigation.navigate("meetingTimes");
    } catch (error) {
      errorContext.setError(strings.errorHandling.meeting.create, error)
    }
  }

  /**
   * Renders meeting contact edit 
   */
  const renderContactEdit = () => (
    <View>
      <Text>{ strings.meetings.contact.title }</Text>
      <TextInput
        value={ newMeeting.contact.firstName }
        label={ strings.meetings.contact.firstName }
        onChangeText={ onNewMeetingContactChange("firstName") }
      />
      <TextInput
        value={ newMeeting.contact.lastName }
        label={ strings.meetings.contact.lastName }
        onChangeText={ onNewMeetingContactChange("lastName") }
      />
      <TextInput
        value={ newMeeting.contact.phone }
        label={ strings.meetings.contact.phone }
        onChangeText={ onNewMeetingContactChange("phone") }
      />
      <TextInput
        value={ newMeeting.contact.email }
        label={ strings.meetings.contact.email }
        onChangeText={ onNewMeetingContactChange("email") }
      />
    </View>
  );

  /**
   * Renders meeting contact edit 
   */
  const renderLanguageSelect = () => {
    const options = Object.values(MeetingLanguage).map(language => ({ label: language, value: language }));

    <DropDown
      list={ options }
      onDismiss={ () => setLanguageDropDown(false) }
      value={ newMeeting.language }
      setValue={ onNewMeetingChange("language") }
      showDropDown={ () => setLanguageDropDown(true) }
      visible={ languageDropDown }
      mode="outlined"
      dropDownContainerMaxHeight={ 500 }
      dropDownStyle={{ marginTop: 45 }}
    />
  }

  /**
   * Renders meeting contact edit 
   */
  const renderMeetingTypeSelect = () => {
    const options = Object.values(MeetingType).map(type => ({ label: type, value: type }));

    <DropDown
      list={ options }
      onDismiss={ () => setMeetingTypeDropDown(false) }
      value={ newMeeting.type }
      setValue={ onNewMeetingChange("type") }
      showDropDown={ () => setMeetingTypeDropDown(true) }
      visible={ meetingTypeDropDown }
      mode="outlined"
      dropDownContainerMaxHeight={ 500 }
      dropDownStyle={{ marginTop: 45 }}
    />
  }

  /**
   * Renders meeting contact edit 
   */
  const renderButtons = () => (
    <>
      <Button
        onPress={ onMeetingCancel }
        style={ styles.backButton }
      >
        { strings.generic.back }
      </Button>
      <Button
        onPress={ onMeetingCreate }
        style={ styles.confirmButton }
      >
        { strings.generic.create }
      </Button>
    </>
  )

  /**
   * Component render 
   */
  return (
    <Card>
      <View>
        { renderContactEdit() }
        { renderLanguageSelect() }
        { renderMeetingTypeSelect() }
        <TextInput
          value={ newMeeting.participantCount.toString() }
          label={ strings.meetings.participantCount }
          onChangeText={ onNewMeetingChange("participantCount") }
          keyboardType="numeric"
        />
        <TextInput
          value={ newMeeting.additionalInformation }
          label={ strings.meetings.additionalInformation }
          onChangeText={ onNewMeetingChange("additionalInformation") }
        />
      </View>
      { renderButtons() }
    </Card>
  );
};

export default NewMeetingScreen;