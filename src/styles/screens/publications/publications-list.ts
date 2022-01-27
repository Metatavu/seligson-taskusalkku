import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  listContainer: {
    width: "100%",
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },

  publicationCard: {
    width: "100%",
    marginTop: theme.spacing(1),
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: "#fff",
    overflow: "hidden"
  },

  cardShadow: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 5
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