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
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
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
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
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

  fundName: {
    flexDirection: "row"
  },
  
  cardColumn: {
    flex: 1
  },

  riskMeterContainer: {
    flexDirection: "column",
    alignItems: "flex-end"
  },

  riskMeterBars: {
    flex: 1,
    flexDirection: "row"
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

  tinyLogo: {
    height: 20,
    width: 20,
    resizeMode: "cover",
    marginLeft: theme.spacing(1)
  },

  priceHistoryPercentage: {
    color: theme.colors.primary,
    ...theme.fonts.medium
  },

  priceHistoryPercentageNegative: {
    color: theme.colors.error,
    ...theme.fonts.medium
  },

  divider: {
    marginVertical: theme.spacing(1)
  },

  lastUpdated: {
    paddingLeft: theme.spacing(1)
  }

});

export default fundCardStyles;