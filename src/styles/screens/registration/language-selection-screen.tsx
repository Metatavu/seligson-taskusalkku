import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  container: {
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logoContainer: {
    flex: 3,
    justifyContent: "flex-end"
  },

  circularGradient: {
    height: 240,
    width: 240,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(6),
    borderRadius: 120
  },

  logo: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: "100%",
    justifyContent: "center"
  },

  progressContainer: {
    width: "50%",
    marginTop: 50
  },

  card: {
    width: "100%",
    padding: theme.spacing(2),
    elevation: 8,
    borderRadius: theme.spacing(2),
    borderTopRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowRadius: 5,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },

  cardTitle: {
    fontSize: 16,
    paddingVertical: theme.spacing(1)
  },

  buttonContainer: {
    justifyContent: "flex-end",
    marginBottom: theme.spacing(6),
    flex: 1,
    width: "100%"
  },

  button: {
    marginTop: theme.spacing(2),
    backgroundColor: "#899C35",
    borderRadius: theme.spacing(3),
    width: "100%",
    borderColor: "#fff",
    borderStyle: "solid",
    borderWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  buttonText: {
    color: "#fff"
  }

});