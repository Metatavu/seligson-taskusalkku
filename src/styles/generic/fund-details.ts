import { StyleSheet } from "react-native";
import defaultTheme from "../../theme";

/**
 * Styles for FundCard component
 *
 * @param theme theme
 * @param color color
 */
const fundDetailsStyles = (theme: ReactNativePaper.Theme = defaultTheme, color: string) => StyleSheet.create({

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

  buttonRow: {
    width: "100%",
    flexDirection: "column",
    flexWrap: "nowrap"
  },

  button: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    flex: 1,
    margin: theme.spacing(1),
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3

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