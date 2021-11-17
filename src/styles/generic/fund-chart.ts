import { Dimensions, StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  dateRangeButtonRow: {
    maxWidth: Dimensions.get("window").width,
    overflow: "hidden",
    flexDirection: "row",
    padding: theme.spacing(1)
  },

  dateRangeButton: {
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: "#fff",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 25,
    flex: 1,
    marginRight: 5
  },

  dateRangeButtonSelected: {
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: "#fff",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 25,
    flex: 1,
    marginRight: 5,
    backgroundColor: "#fff"
  },

  dateRangeButtonText: {
    color: "#fff",
    fontSize: 8
  },
  
  dateRangeButtonTextSelected: {
    color: "#3E3F44",
    fontSize: 8
  }

});