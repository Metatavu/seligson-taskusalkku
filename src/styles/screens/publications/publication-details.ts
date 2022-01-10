import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  backButton: {
    backgroundColor: "#899C35",
    borderRadius: 0
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
    overflow: "hidden"
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