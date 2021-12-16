import React from "react";
import { Meeting, MeetingTime, MeetingType } from "../../../generated/client";
import { MeetingsApiContext } from "../../providers/meetings-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";
import MeetingNavigator from "../../../types/navigators/meeting";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MeetingLanguage } from "../../../types";

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
   * Component render 
   */
  return (
    <>
    </>
  );
};

export default NewMeetingScreen;