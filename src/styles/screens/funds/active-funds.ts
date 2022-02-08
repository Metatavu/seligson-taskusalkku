import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  fundList: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },

  funCard: {
    width: "100%",
    marginTop: theme.spacing(1),
    flexDirection: "row",
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: "#fff",
    shadowRadius: 5
  }

});