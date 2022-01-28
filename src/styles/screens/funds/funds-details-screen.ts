import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },

  backButton: {
    backgroundColor: "#899C35",
    borderRadius: 0
  },

  confirmButton: {
    backgroundColor: "#899C35",
    borderRadius: 0
  },

  detailsWrapper: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },

  chart: {
    padding: theme.spacing(1),
    backgroundColor: theme.colors.backgroundDark,
    overflow: "hidden"
  },

  focused: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24
  }

});