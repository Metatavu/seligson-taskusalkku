import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  modalContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    padding: theme.spacing(2),
    width: "85%",
    borderRadius: 25
  },

  titleContainer: {
    marginBottom: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center"
  },

  title: {
    fontSize: 16
  },

  saveButton: {
    backgroundColor: "#899C35",
    borderRadius: 25,
    flex: 1,
    maxWidth: "48%"
  },

  cancelButton: {
    flex: 1,
    maxWidth: "48%",
    borderStyle: "solid",
    borderColor: "#899C35",
    borderWidth: 1,
    borderRadius: 25
  },

  cell: {
    width: 50,
    height: 50,
    lineHeight: 49,
    fontSize: 24,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.backgroundDark,
    backgroundColor: "#fff",
    textAlign: "center",
    color: "#777"
  },

  focused: {
    borderColor: theme.colors?.primary
  },

  errorTextContainer: {
    marginTop: theme.spacing(4),
    alignItems: "center",
    justifyContent: "center"
  },

  errorText: {
    color: theme.colors.error,
    fontSize: 18
  },

  actionButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(2)
  }

});