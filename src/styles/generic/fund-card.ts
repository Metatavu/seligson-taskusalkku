import { StyleSheet } from "react-native";
import defaultTheme from "../../theme";

/**
 * Styles for FundCard component
 */
const fundCardStyles = (theme: ReactNativePaper.Theme = defaultTheme, color: string) => StyleSheet.create({

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
    flex: 1,
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

  divider: {
    marginVertical: theme.spacing(1)
  },

  lastUpdated: {
    paddingLeft: theme.spacing(1)
  }

});

export default fundCardStyles;