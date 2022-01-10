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

  scrollView: {
    flex: 1
  },

  scrollContentContainer: {
    paddingBottom: 16
  },

  overview: {
    padding: theme.spacing(2),
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
    color: "white",
    fontSize: 25
  },

  purchaseText: {
    fontSize: 14,
    color: "white"
  },

  purchaseValue: {
    fontSize: 14,
    color: "white",
    ...theme.fonts.medium
  },

  cardWrapper: {
    width: "100%",
    marginTop: theme.spacing(2),
    paddingHorizontal: theme.spacing(2)
  },

  card: {
    width: "100%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10
  },

  chart: {
    borderTopLeftRadius: 30,
    padding: theme.spacing(1),
    backgroundColor: theme.colors.backgroundDark
  },

  details: {
    borderBottomRightRadius: 30,
    padding: theme.spacing(2),
    backgroundColor: theme.colors.surface
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