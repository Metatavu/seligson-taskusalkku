import { Dimensions, StyleSheet } from "react-native";
import theme from "../../theme";

const screenWidth = Dimensions.get("window").width;
export default StyleSheet.create({

  dateRangeButtonRow: {
    maxWidth: screenWidth,
    overflow: "hidden",
    backgroundColor: "#3E3F44",
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

  dateRangeButtonText: {
    color: "#fff",
    fontSize: 8
  }

});