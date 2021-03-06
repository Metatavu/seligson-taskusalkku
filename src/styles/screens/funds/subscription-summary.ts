import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  subscriptionCard: {
    padding: theme.spacing(2),
    width: "100%",
    elevation: 8,
    borderRadius: theme.spacing(2),
    borderTopRightRadius: 0,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  fundTitleContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing(2)
  },

  fundTitle: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16
  },

  fundColor: {
    height: "100%",
    width: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(1)
  },

  backButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 0
  },

  primaryLabel: {
    color: theme.colors.primary,
    ...theme.fonts.medium
  },

  dataRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5)
  },

});