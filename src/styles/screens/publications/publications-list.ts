import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  listContainer: {
    width: "100%",
    paddingHorizontal: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },

  publicationCard: {
    width: "100%",
    marginTop: theme.spacing(2),
    elevation: 3,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: "#fff",
    overflow: "hidden"
  },

  publicationTouchable: {
    width: "100%",
    flexDirection: "row",
    padding: theme.spacing(2)
  },

  author: {
    ...theme.fonts.medium,
    fontSize: 16
  },

  divider: {
    marginVertical: theme.spacing(1)
  },

  dateIcon: {
    color: theme.colors.grey[600],
    fontSize: 16
  },

  date: {
    fontSize: 12,
    marginLeft: theme.spacing(1),
    color: theme.colors.grey[600]
  }

});