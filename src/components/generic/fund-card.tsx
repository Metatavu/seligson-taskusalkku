/* eslint-disable no-underscore-dangle */
import React from "react";
import { View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../theme";
import fundCardStyles from "../../styles/generic/fund-card";
import { Fund } from "../../generated/client";
import strings from "../../localization/strings";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
}

/**
 * Fund card
 *
 * @param props component properties
 */
const FundCard: React.FC<Props> = ({ fund }) => {
  const { color, name, risk, changeData, priceDate } = fund;
  const styles = fundCardStyles(useTheme(), color || "#FFF");

  /**
   * Component for price history
   *
   * @param label price history label
   * @param percentage price history percentage
   */
  const renderPriceHistory = (label: string, percentage: number | undefined) => {
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
          { Array(risk).fill(
            <LinearGradient
              colors={ ["transparent", "rgba(0,0,0,0.5)"] }
              style={ styles.riskMeterOn }
            />
          )}
          { Array(7 - Number(risk)).fill(
            <LinearGradient
              colors={ ["transparent", "rgba(0,0,0,0.5)"] }
              style={ styles.riskMeterOff }
            />
          )}
        </View>
        <Text>
          { strings.fundCard.riskLevel }
          { " " }
          { risk }
        </Text>
      </View>
    );
  };
  
  /**
   * Component render
   */
  return (
    <View style={ styles.cardWrapper }>
      <View style={ styles.gradientContainer }>
        <LinearGradient
          colors={ ["transparent", "rgba(0,0,0,0.5)"] }
          style={ styles.gradient }
        />
      </View>
      <View style={ styles.cardContent }>
        <View style={ styles.cardRow }>
          <View style={ styles.cardColumn }>
            <View style={ styles.fundName }>
              <Text style={ theme.fonts.medium }>
                { name.fi }
              </Text>
              {/*               { lahiTapiola &&
                <Image
                  // eslint-disable-next-line global-require
                  source={ require("../../../assets/ltLogo.jpg") }
                  style={ styles.tinyLogo }
                />
              } */}
            </View>
            <View style={ styles.cardRow }>
              <Icon name="calendar" size={ 12 } color={ color }/>
              <Text style={ styles.lastUpdated }>
                { priceDate?.toLocaleDateString() }
              </Text>
            </View>
          </View>
          { renderRiskMeter() }
        </View>
        <Divider style={ styles.divider }/>
        <View style={ styles.cardRow }>
          { renderPriceHistory(strings.fundCard.historyOneDay, changeData?._1dChange) }
          { renderPriceHistory(strings.fundCard.historyOneMonth, changeData?._1dChange) }
          { renderPriceHistory(strings.fundCard.historyOneYear, changeData?._1dChange) }
          { renderPriceHistory(strings.fundCard.historyFiveYears, changeData?._1dChange) }
          { renderPriceHistory(strings.fundCard.historyTwentyYears, changeData?._1dChange) }
        </View>
      </View>
    </View>
  );
};

export default FundCard;