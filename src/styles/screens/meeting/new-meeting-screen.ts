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
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    borderTopRightRadius: 0,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  meetingTitle: {
    fontSize: 16,
    marginVertical: theme.spacing(1)
  },

  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.grey[400],
    borderStyle: "solid",
    borderRadius: 8,
    padding: theme.spacing(2),
    marginTop: theme.spacing(1)
  },

  multilineInput: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.grey[400],
    borderStyle: "solid",
    borderRadius: 8,
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    minHeight: 100
  },

  radioButtonText: {
    flexDirection: "row",
    paddingLeft: 0,
    paddingBottom: 0
  },

  meetingTime: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing(2)
  },

  backButton: {
    borderRadius: theme.spacing(3),
    flex: 1,
    borderWidth: 1,
    borderColor: "#899C35",
    borderStyle: "solid",
    maxWidth: "48%"
  },

  reserveButton: {
    borderRadius: theme.spacing(3),
    flex: 1,
    backgroundColor: "#899C35",
    maxWidth: "48%"
  }

});