import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

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
    borderTopLeftRadius: 30,
    padding: theme.spacing(1),
    backgroundColor: theme.colors.backgroundDark
  }

});