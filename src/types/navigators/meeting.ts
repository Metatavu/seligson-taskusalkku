import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Meeting, MeetingTime } from "../../generated/client";

/**
 * Fund selection navigator
 */
namespace MeetingNavigator {

  /**
   * Routes
   */
  export type Routes = {
    meetingTimes: { createdMeeting: Meeting } | undefined;
    newMeeting: { meetingTime: MeetingTime };
  };

  /**
   * Navigation properties
   */
  export type NavigationProps<RouteName extends keyof Routes = keyof Routes> = NativeStackNavigationProp<Routes, RouteName>;

  /**
   * Route properties
   */
  export type RouteProps<RouteName extends keyof Routes = keyof Routes> = RouteProp<Routes, RouteName>;

  /**
   * Screen properties
   */
  export type ScreenProps<RouteName extends keyof Routes = keyof Routes> = NativeStackScreenProps<Routes, RouteName>;

}

export default MeetingNavigator;