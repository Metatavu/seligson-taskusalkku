import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },

  cardWrapper: {
    width: "100%",
    marginTop: theme.spacing(1),
    flexDirection: "row",
    borderRadius: theme.spacing(2),
    borderTopRightRadius: 0,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  backButton: {
    backgroundColor: "#899C35"
  },

  confirmButton: {
    backgroundColor: "#899C35"
  },

  detailsWrapper: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },

  chart: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.surface,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
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