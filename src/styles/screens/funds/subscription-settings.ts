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
    fontSize: 16
  },

  fundColor: {
    height: "100%",
    width: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(1)
  },

  backButton: {
    borderRadius: theme.spacing(3),
    marginTop: theme.spacing(3)
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

  select: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  copyText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  sumInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },

  sumTextInput: {
    width: 100,
    padding: theme.spacing(1),
    flexDirection: "row",
    borderRadius: 4,
    borderColor: theme.colors.grey[400],
    borderStyle: "solid",
    borderWidth: 1,
    alignItems: "center",
    marginRight: theme.spacing(1)
  },

  sumText: {
    flex: 1,
    textAlign: "right",
    marginRight: 3
  },

  validSum: {
    color: "red",
    marginBottom: theme.spacing(2)
  },

  invalidSum: {
    backgroundColor: "red",
    opacity: 0,
    height: 0
  }

});