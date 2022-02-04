import { StyleSheet } from "react-native";
import theme from "../../../theme";

export default StyleSheet.create({

  gradientWrapper: {
    flex: 1
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center"
  },

  chartLoaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },

  scrollView: {
    flex: 1
  },

  scrollContentContainer: {
    paddingBottom: 16
  },

  overview: {
    paddingTop: theme.spacing(1),
    backgroundColor: theme.colors.backgroundDark,
    display: "flex"
  },

  overviewRow: {
    marginTop: theme.spacing(1),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },

  totalIcon: {
    marginRight: 8
  },

  totalText: {
    fontSize: 25
  },

  purchaseText: {
    fontSize: 14
  },

  purchaseValue: {
    fontSize: 14,
    ...theme.fonts.medium
  },

  cardWrapper: {
    width: "100%",
    marginTop: theme.spacing(2),
    paddingHorizontal: theme.spacing(2)
  },

  card: {
    width: "100%"
  },

  chart: {
    padding: theme.spacing(1),
    backgroundColor: theme.colors.backgroundDark
  },

  focused: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24
  },

  details: {
    borderBottomRightRadius: 30,
    padding: theme.spacing(2),
    backgroundColor: theme.colors.surface,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10
  },

  detailContainer: {
    padding: 20,
    backgroundColor: "white"
  },

  detailRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(1)
  },

  detailRowTitle: {
    fontSize: 14
  },

  detailRowValue: {
    ...theme.fonts.medium,
    fontSize: 14
  }

});