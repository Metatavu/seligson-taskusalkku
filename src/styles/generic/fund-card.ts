import { StyleSheet } from "react-native";
import defaultTheme from "../../theme";

/**
 * Styles for FundCard component
 */
const fundCardStyles = (theme: ReactNativePaper.Theme = defaultTheme, color: string) => StyleSheet.create({

  cardWrapper: {
    width: "100%",
    marginTop: theme.spacing(1),
    flexDirection: "row",
    elevation: 8,
    borderRadius: theme.spacing(2),
    borderTopRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: "#fff",
    shadowRadius: 5
  },

  gradientContainer: {
    width: "5%",
    borderRadius: 0,
    overflow: "hidden",
    borderTopLeftRadius: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(2)
  },

  gradient: {
    backgroundColor: color,
    flex: 1
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

  shareRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  fundName: {
    flexDirection: "row",
    alignItems: "center"
  },

  cardColumn: {
    flex: 1
  },

  riskMeterContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start"
  },

  riskMeterBars: {
    flexDirection: "row",
    height: 16,
    marginRight: theme.spacing(1)
  },

  riskMeterOn: {
    backgroundColor: "#899C35",
    height: "100%",
    width: 8,
    borderRadius: 2,
    marginLeft: 2
  },

  riskMeterOff: {
    backgroundColor: "#BDBDBD",
    height: "100%",
    width: 8,
    borderRadius: 2,
    marginLeft: 2
  },

  positiveValue: {
    color: theme.colors.primary,
    ...theme.fonts.medium
  },

  negativeValue: {
    color: theme.colors.error,
    ...theme.fonts.medium
  },

  divider: {
    marginVertical: theme.spacing(1)
  },

  lastUpdated: {
    paddingLeft: theme.spacing(1),
    color: theme.colors.grey[600]
  },

  fundLogoContainer: {
    height: 24,
    width: 24,
    marginRight: theme.spacing(1),
    justifyContent: "center",
    alignItems: "center"
  },

  riskText: {
    color: theme.colors.grey[600]
  }

});

export default fundCardStyles;