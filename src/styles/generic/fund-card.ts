import { StyleSheet } from "react-native";
import defaultTheme from "../../theme";

/**
 * Styles for FundCard component
 */
const fundCardStyles = (theme: ReactNativePaper.Theme = defaultTheme) => StyleSheet.create({

  cardWrapper: {
    marginTop: 10,
    width: 350,
    height: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    elevation: 8,
    flexDirection: "row",
    borderRadius: 25,
    borderTopRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: "#fff"
  },
  
  cardContent: {
    flexDirection: "column",
    height: "100%",
    width: "95%",
    padding: 10
  },

  cardRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 12
  },

  cardDate: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 12,
    color: "gray"
  },
  
  cardColumn: {
    alignItems: "flex-start",
    flex: 1
  },

  fundViewName: {
    flex: 1,
    width: "100%"
  },

  priceHistoryRow: {
    width: "100%",
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "gray"
  },

  priceHistoryText: {
    width: "100%",
    flex: 1,
    textAlign: "center"
  },

  cardRisk: {
    height: "100%",
    alignItems: "center"
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