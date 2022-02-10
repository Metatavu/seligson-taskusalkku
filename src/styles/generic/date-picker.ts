import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  datePickerIos: {
    backgroundColor: "white",
    borderRadius: theme.spacing(2)
  },

  modalView: {
    justifyContent: "center",
    padding: theme.spacing(2),
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%"
  },

  datePickerButton: {
    width: 120
  },

  selectedMeetingTime: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing(2),
    flex: 1
  }

});