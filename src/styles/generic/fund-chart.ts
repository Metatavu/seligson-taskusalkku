import { Dimensions, StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  chartContainer: {
    minHeight: 353,
    backgroundColor: "#3E3F44"
  },

  dateRangeButtonRow: {
    maxWidth: Dimensions.get("window").width,
    overflow: "hidden",
    flexDirection: "row",
    padding: theme.spacing(1),
    justifyContent: "space-evenly"
  },

  dateRangeButton: {
    alignItems: "center",
    borderColor: "#fff",
    borderStyle: "solid",
    margin: 0,
    minWidth: 40
  },

  dateRangeButtonSelected: {
    alignItems: "center",
    borderColor: "#fff",
    borderStyle: "solid",
    marginRight: 5,
    backgroundColor: "#fff",
    margin: 0,
    minWidth: 40
  },

  dateRangeButtonText: {
    color: "#fff",
    fontSize: 12
  },
  
  dateRangeButtonTextSelected: {
    color: "#3E3F44",
    fontSize: 12
  }

});