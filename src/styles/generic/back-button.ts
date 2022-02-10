import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  buttonContainer: {
    height: 60,
    backgroundColor: "#899C35",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  backButton: {
    borderRadius: theme.spacing(3)
  }

});