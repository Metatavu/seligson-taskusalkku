import { StyleSheet } from "react-native";
import defaultTheme from "../../theme";

/**
 * Styles for FundCard component
 *
 * @param theme theme
 * @param color color
 */
const transactionsCardStyles = (theme: ReactNativePaper.Theme = defaultTheme, color: string) => StyleSheet.create({

  cardWrapper: {
    width: "100%",
    marginTop: theme.spacing(1),
    flexDirection: "row",
    elevation: 8,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: "#fff",
    shadowRadius: 5,
    marginBottom: theme.spacing(1)
  },
  
  cardContent: {
    flexDirection: "column",
    padding: theme.spacing(2),
    flex: 1
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
  },

  labelText: {
    color: theme.colors.grey[600]
  },

  transactionWrapper: {
    flexDirection: "row",
    marginVertical: theme.spacing(1)
  },

  colorBar: {
    width: theme.spacing(1),
    marginRight: theme.spacing(1),
    height: "100%",
    borderRadius: 50
  },

  transactionContent: {
    flex: 1
  },

  transactionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1
  },

  transactionsList: {
    marginTop: theme.spacing(1)
  }

});

export default transactionsCardStyles;