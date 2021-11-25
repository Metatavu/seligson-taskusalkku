import React from "react";
import { View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../theme";
import fundCardStyles from "../../styles/generic/fund-card";
import { Fund } from "../../generated/client";
import strings from "../../localization/strings";
import GenericUtils from "../../utils/generic";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
}

/**
 * Portfolio fund card
 *
 * @param props component properties
 */
const PortfolioFundCard: React.FC<Props> = ({ fund }) => {
  const { color, longName, risk, changeData, priceDate } = fund;
  const styles = fundCardStyles(useTheme(), color || "#FFF");

  /**
   * Component for price history
   *
   * @param label price history label
   * @param percentage price history percentage
   */
  const renderPriceHistory = (label: string, percentage?: number) => {
    const percentageStyle = percentage && percentage < 0 ?
      styles.priceHistoryPercentageNegative :
      styles.priceHistoryPercentage;

    return (
      <View style={ styles.cardColumn }>
        <Text>
          { label }
        </Text>
        <Text style={ percentageStyle }>
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
    const riskLevelText = `${strings.fundCard.riskLevel} ${risk}`;

    if (!risk) {
      return null;
    }

    const riskArray = Array.from({ length: 7 }, (_, index) => (
      <LinearGradient
        // eslint-disable-next-line react/no-array-index-key
        key={ index }
        colors={[ "transparent", "rgba(0,0,0,0.5)" ]}
        style={ index < risk ? styles.riskMeterOn : styles.riskMeterOff }
      />
    ));

    return (
      <View style={ styles.riskMeterContainer }>
        <View style={ styles.riskMeterBars }>
          { riskArray }
        </View>
        <Text>
          { riskLevelText }
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
          colors={[ "transparent", "rgba(0,0,0,0.5)" ]}
          style={ styles.gradient }
        />
      </View>
      <View style={ styles.cardContent }>
        <View style={ styles.cardRow }>
          <View style={ styles.cardColumn }>
            <View style={ styles.fundName }>
              <Text style={ theme.fonts.medium }>
                { longName && GenericUtils.getLocalizedValue(longName) }
              </Text>
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
          { renderPriceHistory(strings.fundCard.historyOneDay, changeData?.change1d) }
          { renderPriceHistory(strings.fundCard.historyOneMonth, changeData?.change1m) }
          { renderPriceHistory(strings.fundCard.historyOneYear, changeData?.change1y) }
          { renderPriceHistory(strings.fundCard.historyFiveYears, changeData?.change5y) }
          { renderPriceHistory(strings.fundCard.historyTwentyYears, changeData?.change20y) }
        </View>
      </View>
    </View>
  );
};

export default PortfolioFundCard;