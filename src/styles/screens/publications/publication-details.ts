import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({
  buttonContainer: {
    margin: theme.spacing(2),
    marginBottom: 0
  },

  backButton: {
    backgroundColor: "#899C35",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3
  },

  publicationContainer: {
    width: "100%",
    padding: theme.spacing(2)
  },

  publicationCard: {
    padding: theme.spacing(2),
    width: "100%",
    elevation: 8,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  title: {
    color: theme.colors.primary,
    fontSize: 24,
    marginVertical: theme.spacing(2),
    marginLeft: theme.spacing(1)
  },

  publicationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8
  }

});