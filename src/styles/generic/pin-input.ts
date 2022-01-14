import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  modalContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    padding: theme.spacing(2),
    width: "90%",
    borderRadius: 8
  },

  titleContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
    alignItems: "center",
    justifyContent: "center"
  },

  title: {
    fontSize: 18,
    color: "black"
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
    justifyContent: "center",
    marginTop: theme.spacing(2)
  }

});