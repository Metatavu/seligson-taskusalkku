import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export default StyleSheet.create({

  overlay: {
    padding: 30,
    flex: 1,
    justifyContent: "center"
  },

  content: {
    padding: theme.spacing(2),
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10
  }

});