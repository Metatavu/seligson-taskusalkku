import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  detailsScreen: {
    flex: 1,
    justifyContent: "center"
  },

  detailsWrapper: {
    width: "95%",
    padding: theme.spacing(2)
  },

  backButton: {
    marginHorizontal: theme.spacing(2),
    backgroundColor: "#899C35",
    borderRadius: 15
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: theme.spacing(1)
  },

  gradientContainer: {
    width: "5%",
    borderRadius: 0,
    overflow: "hidden",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },

  gradient: {
    flex: 1
  },

  cardWrapper: {
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderBottomRightRadius: theme.spacing(2),
    borderTopLeftRadius: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: "row",
    marginHorizontal: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },

  transactionTitle: {
    fontSize: 16,
    marginBottom: theme.spacing(1)
  }

});