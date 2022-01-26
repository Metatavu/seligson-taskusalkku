import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  subscriptionSettings: {
    flex: 1,
    justifyContent: "flex-start",
    padding: theme.spacing(2)
  },

  subscriptionCard: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    overflow: "hidden"
  },

  fundTitle: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing(2)
  },

  fundColor: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: theme.spacing(1)
  },

  backButton: {
    backgroundColor: "#899C35",
    borderRadius: 0
  },

  dropDownLabel: {
    color: "#899C35",
    ...theme.fonts.medium
  },

  dataRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },

  select: {
    display: "flex",
    flexDirection: "row",
    width: 120,
    alignItems: "center",
    justifyContent: "space-between"
  },

  copyText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }

});