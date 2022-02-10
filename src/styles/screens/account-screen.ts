import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  cardWrapper: {
    width: "100%",
    marginTop: theme.spacing(1),
    flexDirection: "row",
    elevation: 8,
    borderRadius: theme.spacing(2),
    borderTopRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: "#fff",
    shadowRadius: 5,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2)
  }

});