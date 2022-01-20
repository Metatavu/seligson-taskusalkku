import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  progressContainer: {
    width: "50%",
    marginTop: 50
  },

  card: {
    width: "100%",
    marginTop: theme.spacing(1),
    elevation: 8,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: "#fff",
    shadowRadius: 5,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: theme.spacing(1)
  }

});