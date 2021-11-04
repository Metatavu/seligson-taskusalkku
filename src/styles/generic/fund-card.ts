import { StyleSheet } from "react-native";
import defaultTheme from "../../theme";

/**
 * Styles for FundCard component
 */
const fundCardStyles = (theme: ReactNativePaper.Theme = defaultTheme) => StyleSheet.create({

  cardWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 10,
    flexDirection: "row",
    elevation: 8,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
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
    resizeMode: "cover"
  },

  priceHistoryPercentage: {
    color: theme.colors.primary,
    ...theme.fonts.medium
  }

});

export default fundCardStyles;