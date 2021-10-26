import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export default StyleSheet.create({

  headerStyle: {
    backgroundColor: theme.colors.background,
    elevation: 0,
    shadowOffset: { width: 0, height: 0 }
  },

  logoContainer: {
    width: 100,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },

  logo: {
    width: 100,
    height: 30
  },

  buttonStyle: {
    borderRadius: 60
  }

});