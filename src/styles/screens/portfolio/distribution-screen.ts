import { Dimensions, StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  distributionCard: {
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
    borderRadius: 25,
    borderTopRightRadius: 0,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    maxHeight: Dimensions.get("window").height / 3
  },

  chartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: theme.spacing(2)
  },

  viewContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing(2)
  },

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  securityCategory: {
    flexDirection: "row",
    paddingVertical: theme.spacing(1)
  },

  categoryColor: {
    height: "100%",
    width: theme.spacing(1),
    borderRadius: 10,
    marginRight: theme.spacing(1)
  }

});