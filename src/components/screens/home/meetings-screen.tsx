import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MeetingSelectionNavigator from "../../../types/navigators/meeting";
import MeetingTimesScreen from "../meeting/meeting-times-screen";
import NewMeetingScreen from "../meeting/new-meeting-screen";

/**
 * Meetings screen navigation
 */
const MeetingSelectionNavigation = createNativeStackNavigator<MeetingSelectionNavigator.Routes>();

/**
 * Meetings screen
 */
const MeetingsScreen: React.FC = () => (
  <MeetingSelectionNavigation.Navigator
    initialRouteName="meetingTimes"
    screenOptions={{ headerShown: false }}
  >
    <MeetingSelectionNavigation.Screen
      name="meetingTimes"
      component={ MeetingTimesScreen }
    />
    <MeetingSelectionNavigation.Screen
      name="newMeeting"
      component={ NewMeetingScreen }
    />
  </MeetingSelectionNavigation.Navigator>
);

export default MeetingsScreen;