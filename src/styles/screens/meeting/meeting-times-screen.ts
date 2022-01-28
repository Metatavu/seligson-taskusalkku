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
    borderRadius: 25,
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

  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  datePickerIos: {
    backgroundColor: "white",
    borderRadius: 25
  },

  modalView: {
    justifyContent: "center",
    padding: theme.spacing(2),
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%"
  },

  meetingTime: {
    padding: theme.spacing(1)
  },

  noAvailableTime: {
    marginTop: theme.spacing(2)
  },

  datePickerButton: {
    width: 120
  },

  selectedMeetingTime: {
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    flex: 1,
    width: "100%"
  }

});