import { StyleSheet } from "react-native";
import defaultTheme from "../../theme";

/**
 * Styles for FundCard component
 */
const fundDetailsStyles = (theme: ReactNativePaper.Theme = defaultTheme) => StyleSheet.create({

  cardWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 5,
    flexDirection: "row",
    elevation: 8,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexWrap: "wrap",
    height: 90,
    marginBottom: 100
  },
  
  cardContent: {
    flexDirection: "column",
    width: "95%",
    padding: 10
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  
  cardColumn: {
    flex: 1
  },

  priceHistoryPercentage: {
    color: theme.colors.primary,
    ...theme.fonts.medium
  },

  button: {
    backgroundColor: "#FFF",
    marginTop: 10,
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

  logoWide: {
    width: "50%",
    maxHeight: 40,
    alignSelf: "center"
  }

});

export default fundDetailsStyles;