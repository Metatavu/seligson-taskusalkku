import React from "react";
import { View, Image } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../theme";
import fundCardStyles from "../../styles/generic/fund-card";
import { FundData } from "../../types";

/**
 * Component properties
 */
interface Props {
  fund: FundData;
}

/**
 * Fund card
 *
 * @param props component properties
 */
const FundCard: React.FC<Props> = ({ fund }) => {
  const styles = fundCardStyles(useTheme());
  const { color, fundName, priceHistory, lahiTapiola, lastUpdated, riskLevel } = fund;

  /**
   * Component for price history
   *
   * @param label price history label
   * @param percentage price history percentage
   * @param lastUpdated last update date on price history
   */
  const renderPriceHistory = (label: string, percentage: number) => {
    return (
      <View style={ styles.cardColumn }>
        <Text>
          { label }
        </Text>
        <Text style={ styles.priceHistoryPercentage } >
          { percentage }
          %
        </Text>
      </View>
    );
  };
  
  /**
   * Risk meter
   */
  const RiskMeter = () => {
    return (
      <View style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-end"
      }}
      >
        <View style={{
          flex: 1,
          flexDirection: "row"
        }}
        >
          { Array(riskLevel).fill(
            <LinearGradient
              colors={[ "transparent", "rgba(0,0,0,0.5)" ]}
              style={ styles.riskMeterOn }
            />
          )}
          { Array(7 - Number(riskLevel)).fill(
            <LinearGradient
              colors={[ "transparent", "rgba(0,0,0,0.5)" ]}
              style={ styles.riskMeterOff }
            />
          )}
        </View>
        <Text>
          {"Riskitaso "}
          { riskLevel }
        </Text>
      </View>
    );
  };
  
  /**
   * Component render
   */
  return (
    <View style={ styles.cardWrapper }>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.5)"]}
        style={{
          backgroundColor: color,
          width: "5%",
          height: "100%"
        }}
      />
      <View style={styles.cardContent}>
        <View style={ styles.cardRow }>
          <View style={ styles.cardColumn }>
            <View style={{ flexDirection: "row" }}>
              <Text style={ theme.fonts.medium }>
                { fundName }
              </Text>
              {lahiTapiola ? (
                <Image
                  // eslint-disable-next-line global-require
                  source={ require("../../../assets/ltLogo.jpg") }
                  style={ styles.tinyLogo }
                />
              ) : null}
            </View>
            <View style={ styles.cardRow }>
              <Icon name="calendar" size={12} color={ color }/>
              <Text style={{ paddingLeft: 5 }}>
                { lastUpdated }
              </Text>
            </View>
          </View>
          <RiskMeter/>
        </View>
        <Divider style={{ marginVertical: 5 }}/>
        <View style={ styles.cardRow }>
          { renderPriceHistory("1pv", priceHistory.oneDay) }
          { renderPriceHistory("1kk", priceHistory.oneMonth) }
          { renderPriceHistory("1v", priceHistory.oneYear) }
          { renderPriceHistory("5v", priceHistory.fiveYears) }
          { renderPriceHistory("20v", priceHistory.twentyYears) }
        </View>
      </View>
    </View>
  );
};

export default FundCard;