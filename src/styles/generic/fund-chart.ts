import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  dateRangeButtonRow: {
    maxWidth: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: theme.spacing(1)
  },

  dateRangeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: theme.colors.primary,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: theme.spacing(2),
    margin: 0,
    minWidth: 40
  },

  datePickerButton: {
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing(1),
    borderRadius: theme.spacing(3)
  },

  iconButton: {
    padding: theme.spacing(1),
    borderColor: theme.colors.primary,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 17,
    textAlign: "center",
    marginLeft: theme.spacing(1)
  },

  dateRangeButtonSelected: {
    backgroundColor: theme.colors.primary
  },

  dateRangeButtonText: {
    color: theme.colors.primary,
    fontSize: 10,
    marginVertical: 0,
    marginHorizontal: 0,
    padding: 8
  },

  dateRangeButtonTextSelected: {
    color: "#fff",
    fontSize: 10
  }

});