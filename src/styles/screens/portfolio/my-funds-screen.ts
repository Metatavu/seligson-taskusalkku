import { Dimensions, StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  viewContainer: {
    display: "flex",
    alignItems: "center"
  },

  totalContainer: {
    padding: theme.spacing(2),
    backgroundColor: "#3E3F44",
    alignItems: "center",
    justifyContent: "center"
  },

  totalContent: {
    display: "flex",
    alignItems: "center"
  },

  totalTextContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

  totalText: {
    color: "white",
    fontSize: 25,
    marginLeft: 5
  },

  totalPurchaseContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-evenly",
    width: Dimensions.get("window").width
  },

  purchaseText: {
    fontSize: 14,
    color: "white"
  },

  cardWrapper: {
    paddingTop: 15,
    width: "95%",
    marginTop: theme.spacing(1),
    elevation: 8,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: "#3E3F44",
    shadowRadius: 5,
    marginBottom: 10
  },

  infoContainer: {
    padding: 20,
    backgroundColor: "white"
  },

  infoRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(1)
  },

  infoRowTitle: {
    fontSize: 14
  },

  infoRowValue: {
    fontWeight: "bold",
    fontSize: 14
  }

});