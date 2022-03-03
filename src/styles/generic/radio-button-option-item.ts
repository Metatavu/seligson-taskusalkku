import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({

  radioButtonContainer: {
    paddingBottom: theme.spacing(1)
  },

  radioButtonReversed: {
    flexDirection: "row",
    paddingLeft: 0,
    paddingBottom: 0
  },

  notSelected: {
    color: "gray"
  },

  checked: {
    color: theme.colors.primary,
    paddingLeft: 0
  },

  noDescription: {
    height: 0
  },

  needsLogin: {
    marginTop: theme.spacing(1)
  }
});