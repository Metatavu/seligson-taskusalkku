import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  buttonContainer: {
    margin: theme.spacing(2),
    marginBottom: 0
  },

  backButton: {
    backgroundColor: "#899C35",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3
  }

});