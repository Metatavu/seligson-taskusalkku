import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  distributionCard: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    marginTop: theme.spacing(2),
    borderRadius: 0,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25
  },

  chartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    padding: theme.spacing(2)
  },

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  securityCategory: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    // flexWrap: "wrap",
    alignItems: "center",
    marginBottom: theme.spacing(2)
  },

  categoryColor: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: theme.spacing(1)
  }

});