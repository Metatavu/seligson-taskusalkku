import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  meetingTimes: {
    flex: 1,
    justifyContent: "flex-start",
    padding: theme.spacing(2)
  },

  meetingCard: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1)
  },

  datePicker: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: theme.spacing(1)
  },

  meetingTime: {
    padding: theme.spacing(1)
  }

});