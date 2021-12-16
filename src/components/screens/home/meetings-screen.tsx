import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MeetingSelectionNavigator from "../../../types/navigators/meeting";
import MeetingTimesScreen from "../meeting/meeting-times-screen";
import NewMeetingScreen from "../meeting/new-meeting-screen";

/**
 * Fund selection screen stack navigation
 */
const MeetingSelectionNavigation = createNativeStackNavigator<MeetingSelectionNavigator.Routes>();

/**
 * Active funds screen
 */
const FundsScreen: React.FC = () => {
  /**
   * Component render
   */
  return (
    <MeetingSelectionNavigation.Navigator
      initialRouteName="meetingTimes"
      screenOptions={{
        headerShown: false
      }}
    >
      <MeetingSelectionNavigation.Group>
        <MeetingSelectionNavigation.Screen
          name="meetingTimes"
          component={ MeetingTimesScreen }
        />
        <MeetingSelectionNavigation.Screen
          name="newMeeting"
          component={ NewMeetingScreen }
        />
      </MeetingSelectionNavigation.Group>
    </MeetingSelectionNavigation.Navigator>
  );
};

export default FundsScreen;