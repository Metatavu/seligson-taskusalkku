import React from "react";
import { Meeting, MeetingType } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";
import MeetingNavigator from "../../../types/navigators/meeting";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MeetingLanguage } from "../../../types";
import { Button, Card, RadioButton, TextInput } from "react-native-paper";
import strings from "../../../localization/strings";
import { View } from "react-native";
import { Text } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import styles from "../../../styles/screens/meeting/new-meeting-screen";
import theme from "../../../theme";

/**
 * Meetings screen
 */
const NewMeetingScreen: React.FC = () => {
  const meetingsApiContext = React.useContext(MeetingsApiContext);
  const navigation = useNavigation<MeetingNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);
  const { params } = useRoute<MeetingNavigator.RouteProps>();
  const meetingTIme = params?.meetingTime;

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
      <Text>{ strings.meetings.newMeeting.contact.title }</Text>
      <TextInput
        style={ styles.input }
        value={ newMeeting.contact.firstName }
        label={ strings.meetings.newMeeting.contact.firstName }
        onChangeText={ onNewMeetingContactChange("firstName") }
      />
      <TextInput
        style={ styles.input }
        value={ newMeeting.contact.lastName }
        label={ strings.meetings.newMeeting.contact.lastName }
        onChangeText={ onNewMeetingContactChange("lastName") }
      />
      <TextInput
        style={ styles.input }
        value={ newMeeting.contact.phone }
        label={ strings.meetings.newMeeting.contact.phone }
        onChangeText={ onNewMeetingContactChange("phone") }
      />
      <TextInput
        style={ styles.input }
        value={ newMeeting.contact.email }
        label={ strings.meetings.newMeeting.contact.email }
        onChangeText={ onNewMeetingContactChange("email") }
      />
    </View>
  );

  /**
   * Renders meeting contact edit 
   */
  const renderLanguageSelect = () =>  (
    <View style={{ marginTop: theme.spacing(1) }}>
      <Text>{ strings.meetings.newMeeting.meetingLanguage }</Text>
      <RadioButton.Group onValueChange={ onNewMeetingChange("language") } value={ newMeeting.language }>
        <RadioButton.Item
          labelStyle={{ textAlign: "left" }}
          position="leading"
          color={ theme.colors.primary }
          label={ MeetingLanguage.EN }
          value={ MeetingLanguage.EN }
        />
        <RadioButton.Item
          position="leading"
          labelStyle={{ textAlign: "left" }}
          color={ theme.colors.primary }
          label={ MeetingLanguage.FI }
          value={ MeetingLanguage.FI }
        />
      </RadioButton.Group>
    </View>
  )

  /**
   * Renders meeting contact edit 
   */
  const renderMeetingTypeSelect = () => (
    <View style={{ marginTop: theme.spacing(1) }}>
      <Text>{ strings.meetings.newMeeting.meetingType.title }</Text>
      <RadioButton.Group onValueChange={ onNewMeetingChange("type") } value={ newMeeting.type }>
        <RadioButton.Item
          position="leading"
          labelStyle={{ textAlign: "left" }}
          color={ theme.colors.primary }
          label={ strings.meetings.newMeeting.meetingType.phone }
          value={ MeetingType.Phone }
        />
        <RadioButton.Item
          position="leading"
          labelStyle={{ textAlign: "left" }}
          color={ theme.colors.primary }
          label={ strings.meetings.newMeeting.meetingType.meeting }
          value={ MeetingType.Meeting }
        />
      </RadioButton.Group>
    </View>
  )

  /**
   * Renders meeting contact edit 
   */
  const renderButtons = () => (
    <>
      <Button
        onPress={ onMeetingCancel }
      >
        { strings.generic.back }
      </Button>
      <Button
        onPress={ onMeetingCreate }
      >
        { strings.generic.create }
      </Button>
    </>
  )

  /**
   * Component render 
   */
  return (
    <ScrollView>
      <View style={ styles.newMeeting }>
        <Text style={ theme.fonts.medium }>{ strings.meetings.newMeeting.title }</Text>
        <View style={{ marginTop: theme.spacing(1) }}>
          <Card style={ styles.meetingCard }>
            <View>
              { renderContactEdit() }
              { renderLanguageSelect() }
              { renderMeetingTypeSelect() }
              <TextInput
                style={ styles.input }
                value={ newMeeting.participantCount.toString() }
                label={ strings.meetings.newMeeting.participantCount }
                onChangeText={ onNewMeetingChange("participantCount") }
                keyboardType="numeric"
              />
              <TextInput
                multiline
                mode="outlined"
                numberOfLines={ 6 }
                style={ styles.input }
                value={ newMeeting.additionalInformation }
                label={ strings.meetings.newMeeting.additionalInformation }
                onChangeText={ onNewMeetingChange("additionalInformation") }
              />
            </View>
            { renderButtons() }
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

export default NewMeetingScreen;