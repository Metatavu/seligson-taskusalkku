import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  distributionCard: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1)
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

  securityLegend: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing(1)
  },

  legendColor: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: theme.spacing(1)
  }

});