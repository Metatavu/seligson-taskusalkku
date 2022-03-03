import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  datePickers: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  filterButton: {
    width: 135,
    marginBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  transactionsWrapper: {
    padding: theme.spacing(2)
  }

});