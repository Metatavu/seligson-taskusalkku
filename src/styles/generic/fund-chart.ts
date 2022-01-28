import { StyleSheet } from "react-native";

export default StyleSheet.create({

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  dateRangeButtonRow: {
    maxWidth: "100%",
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },

  dateRangeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fff",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 15,
    margin: 0,
    minWidth: 40,
    height: 30
  },

  dateRangeButtonSelected: {
    backgroundColor: "#fff"
  },

  dateRangeButtonText: {
    color: "#fff",
    fontSize: 10,
    marginVertical: 0,
    marginHorizontal: 0,
    padding: 8
  },

  dateRangeButtonTextSelected: {
    color: "#3E3F44",
    fontSize: 10
  }

});