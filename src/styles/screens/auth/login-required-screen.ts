import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({
  
  loginScreen: {
    flex: 1,
    paddingHorizontal: theme.spacing(2),
    justifyContent: "center"
  },

  cardWrapper: {
    flexDirection: "row",
    elevation: 8,
    borderRadius: theme.spacing(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: "#fff",
    shadowRadius: 5,
    padding: theme.spacing(2)
  },
  
  cardContent: {
    flexDirection: "column",
    flex: 1
  },

  loginButton: {
    margin: theme.spacing(2),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing(3)
  },

  errorButton: {
    margin: theme.spacing(2),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing(3)
  },

  titleText: {
    textAlign: "center",
    marginTop: theme.spacing(1)
  },

  linkText: {
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: theme.spacing(1)
  }

});