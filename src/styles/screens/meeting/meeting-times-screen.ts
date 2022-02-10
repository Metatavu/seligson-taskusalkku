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
    width: "100%",
    elevation: 8,
    borderRadius: theme.spacing(2),
    borderTopRightRadius: 0,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  meetingTitle: {
    paddingVertical: theme.spacing(1),
    fontSize: 16
  },

  meetingTime: {
    padding: theme.spacing(1)
  },

  noAvailableTime: {
    marginTop: theme.spacing(2)
  }

});