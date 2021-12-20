import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  newMeeting: {
    flex: 1,
    justifyContent: "flex-start",
    padding: theme.spacing(2)
  },

  meetingCard: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1)
  },

  input: {
    marginTop: theme.spacing(1),
    backgroundColor: "transparent"
  }

});