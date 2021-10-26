import { StyleSheet } from "react-native";
import { theme } from "../../../theme";

export default StyleSheet.create({

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  loaderText: {
    marginTop: theme.spacing(4)
  },

  headerWrapper: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: theme.spacing(4),
    zIndex: 1
  },

  headershadow: {
    height: 36,
    width: "100%"
  },

  contentWrapper: {
    flex: 1
  },

  content: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4)
  },

  noAppointments: {
    textAlign: "center"
  }

});