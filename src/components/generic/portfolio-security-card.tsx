import React from "react";
import { View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../theme";
import fundCardStyles from "../../styles/generic/fund-card";
import { Fund, PortfolioSecurity, Security } from "../../generated/client";
import strings from "../../localization/strings";
import GenericUtils from "../../utils/generic";
import BigNumber from "bignumber.js";

/**
 * Component properties
 */
interface Props {
  portfolioSecurity: PortfolioSecurity;
  security: Security;
  fund: Fund;
}

/**
 * Portfolio fund card component
 *
 * @param props component properties
 */
const PortfolioSecurityCard: React.FC<Props> = ({ portfolioSecurity, security, fund }) => {
  const { amount, purchaseValue, totalValue } = portfolioSecurity;
  const { name, currency } = security;
  const { color, risk, priceDate } = fund;
  const styles = fundCardStyles(useTheme(), color || "#FFF");

  /**
   * Renders title section
   */
  const renderTitle = () => (
    <View style={ styles.cardColumn }>
      <View style={ styles.fundName }>
        <Text style={ theme.fonts.medium }>
          { GenericUtils.getLocalizedValue(name) }
        </Text>
      </View>
      <View style={ styles.cardRow }>
        <Icon name="calendar" size={ 12 } color={ color }/>
        <Text style={ styles.lastUpdated }>
          { priceDate?.toLocaleDateString() }
        </Text>
      </View>
    </View>
  );

  /**
   * Renders risk meter
   */
  const renderRiskMeter = () => {
    if (!risk) {
      return null;
    }

    const riskLevels = Array.from({ length: 7 }, (_, index) => (
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
          { riskLevels }
        </View>
        <Text>
          { `${strings.fundCard.riskLevel} ${risk}` }
        </Text>
      </View>
    );
  };

  /**
   * Renders my shares
   */
  const renderMyShares = () => {
    const changePercentage = new BigNumber(totalValue)
      .minus(purchaseValue)
      .dividedBy(purchaseValue)
      .multipliedBy(100)
      .toNumber();

    return (
      <>
        <View style={ styles.cardColumn }>
          <Text>
            { strings.fundDetailsScreen.myShare }
          </Text>
        </View>
        <View style={ styles.cardColumn }>
          <Text style={{ color: theme.colors.primary }}>
            { strings.fundDetailsScreen.amount }
          </Text>
          <Text>
            { amount }
          </Text>
        </View>
        <View style={ styles.cardColumn }>
          <Text style={{ color: theme.colors.primary }}>
            { strings.fundDetailsScreen.value }
          </Text>
          <Text>
            { `${new BigNumber(totalValue).toFormat(2)}${currency}` }
          </Text>
        </View>
        <View style={ styles.cardColumn }>
          <Text style={{ color: theme.colors.primary }}>
            { strings.fundDetailsScreen.change }
          </Text>
          <Text style={ styles[changePercentage < 0 ? "negativeValue" : "positiveValue"] }>
            { `${changePercentage.toFixed(2)}%` }
          </Text>
        </View>
      </>
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
          { renderTitle() }
          { renderRiskMeter() }
        </View>
        <Divider style={ styles.divider }/>
        <View style={ styles.cardRow }>
          { renderMyShares() }
        </View>
      </View>
    </View>
  );
};

export default PortfolioSecurityCard;