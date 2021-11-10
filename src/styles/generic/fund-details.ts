import { StyleSheet } from "react-native";
import defaultTheme from "../../theme";

/**
 * Styles for FundCard component
 */
const fundDetailsStyles = (theme: ReactNativePaper.Theme = defaultTheme, color: string) => StyleSheet.create({

  cardWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    marginTop: theme.spacing(1),
    flexDirection: "row",
    elevation: 8,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },

  gradient: {
    backgroundColor: color,
    width: "5%",
    height: "100%"
  },

  buttonRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center"
  },

  button: {
    backgroundColor: "#FFF",
    marginTop: theme.spacing(1),
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    elevation: 8,
    borderBottomRightRadius: 25,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    flex: 1,
    minWidth: "50%"
  },
  
  cardContent: {
    flexDirection: "column",
    width: "95%",
    padding: theme.spacing(1)
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  
  cardColumn: {
    flex: 1
  },

  shareColumn: {
    flex: 1,
    alignItems: "center"
  },

  priceHistoryPercentage: {
    color: theme.colors.primary,
    ...theme.fonts.medium
  },

  logoWide: {
    width: "50%",
    maxHeight: 40,
    alignSelf: "center"
  }

});

export default fundDetailsStyles;