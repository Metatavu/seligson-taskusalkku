import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../theme";

// Screen width used to calculate drawer width
const { width } = Dimensions.get("window");

export default StyleSheet.create({

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  solidBackground: {
    flex: 1,
    backgroundColor: "#fff"
  },

  gradientBackground: {
    flex: 1
  },

  drawerMenu: {
    margin: 0,
    width: width * 0.75
  },

  drawerContent: {
    flex: 1,
    backgroundColor: "#fff"
  },

  logoContainer: {
    padding: 16
  },

  menuButtonContainer: {
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0)"
  },

  logoutButtonContainer: {
    marginTop: "auto"
  },

  bottomNavigationContainer: {
    height: 60,
    flexDirection: "row",
    backgroundColor: theme.colors.background
  },

  bottomNavigationColumn: {
    height: "100%",
    flex: 1
  },

  bottomNavigationButton: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  }

});