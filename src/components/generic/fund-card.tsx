import React from "react";
import { View, Image } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../theme";
import fundCardStyles from "../../styles/generic/fund-card";
import { FundData } from "../../types";
import strings from "../../localization/strings";

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
  const { color, fundName, priceHistory, lahiTapiola, lastUpdated, riskLevel } = fund;
  const styles = fundCardStyles(useTheme(), color);

  /**
   * Component for price history
   *
   * @param label price history label
   * @param percentage price history percentage
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
  const renderRiskMeter = () => {
    return (
      <View style={ styles.riskMeterContainer }>
        <View style={ styles.riskMeterBars }>
          { Array(riskLevel).fill(
            <LinearGradient
              colors={ ["transparent", "rgba(0,0,0,0.5)"] }
              style={ styles.riskMeterOn }
            />
          )}
          { Array(7 - Number(riskLevel)).fill(
            <LinearGradient
              colors={ ["transparent", "rgba(0,0,0,0.5)"] }
              style={ styles.riskMeterOff }
            />
          )}
        </View>
        <Text>
          { strings.fundCard.riskLevel }
          {" "}
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
        colors={ ["transparent", "rgba(0,0,0,0.5)"] }
        style={ styles.gradient }
      />
      <View style={ styles.cardContent }>
        <View style={ styles.cardRow }>
          <View style={ styles.cardColumn }>
            <View style={ styles.fundName }>
              <Text style={ theme.fonts.medium }>
                { fundName }
              </Text>
              { lahiTapiola &&
                <Image
                  // eslint-disable-next-line global-require
                  source={ require("../../../assets/ltLogo.jpg") }
                  style={ styles.tinyLogo }
                />
              }
            </View>
            <View style={ styles.cardRow }>
              <Icon name="calendar" size={ 12 } color={ color }/>
              <Text style={ styles.lastUpdated }>
                { lastUpdated }
              </Text>
            </View>
          </View>
          { renderRiskMeter() }
        </View>
        <Divider style={ styles.divider }/>
        <View style={ styles.cardRow }>
          { renderPriceHistory(strings.fundCard.historyOneDay, priceHistory.oneDay) }
          { renderPriceHistory(strings.fundCard.historyOneMonth, priceHistory.oneMonth) }
          { renderPriceHistory(strings.fundCard.historyOneYear, priceHistory.oneYear) }
          { renderPriceHistory(strings.fundCard.historyFiveYears, priceHistory.fiveYears) }
          { renderPriceHistory(strings.fundCard.historyTwentyYears, priceHistory.twentyYears) }
        </View>
      </View>
    </View>
  );
};

export default FundCard;