import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  container: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    flex: 1,
    alignItems: "flex-start"
  },

  card: {
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
    borderRadius: 25,
    borderTopRightRadius: 0,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: theme.spacing(2),
    width: "100%"
  },

  cardTitle: {
    paddingVertical: theme.spacing(1),
    fontSize: 16
  },

  backButton: {
    marginHorizontal: theme.spacing(2),
    marginBottom: theme.spacing(1),
    backgroundColor: "#899C35",
    borderRadius: 15
  },

  buttonText: {
    color: "#fff"
  }

});