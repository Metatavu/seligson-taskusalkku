import React from "react";
import { View, Text } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import fundCardStyles from "../../styles/generic/fund-card";
import { Fund, PortfolioSecurity } from "../../generated/client";
import strings from "../../localization/strings";
import GenericUtils from "../../utils/generic";
import BigNumber from "bignumber.js";
import Calculations from "../../utils/calculations";
import { useNavigation } from "@react-navigation/native";
import HomeNavigator from "../../types/navigators/home";
import { TouchableOpacity } from "react-native-gesture-handler";

/**
 * Component properties
 */
interface Props {
  portfolioSecurity: PortfolioSecurity;
  fund: Fund;
}

/**
 * Portfolio fund card component
 *
 * @param props component properties
 */
const PortfolioSecurityCard: React.FC<Props> = ({ portfolioSecurity, fund }) => {
  const { amount, purchaseValue, totalValue } = portfolioSecurity;
  const { color, risk, priceDate, longName } = fund;
  const theme = useTheme();
  const styles = fundCardStyles(theme, color || "#FFF");
  const navigation = useNavigation<HomeNavigator.NavigationProps>();

  /**
   * Event handler for card click
   */
  const onClick = () => {
    navigation.navigate("funds", { screen: "fundDetails", params: { fund: fund, navigatedFromPortfolio: true } });
  };

  /**
   * Renders title section
   */
  const renderTitle = () => (
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
        <View>
          <Text style={{ fontWeight: theme.fonts.medium.fontWeight }}>
            { strings.fundDetailsScreen.myShare }
          </Text>
        </View>
        <View>
          <Text style={{ color: theme.colors.primary }}>
            { strings.fundDetailsScreen.amount }
          </Text>
          <Text>
            { Calculations.formatNumberStr(amount, 4) }
          </Text>
        </View>
        <View>
          <Text style={{ color: theme.colors.primary }}>
            { strings.fundDetailsScreen.value }
          </Text>
          <Text>
            { Calculations.formatEuroNumberStr(totalValue) }
          </Text>
        </View>
        <View>
          <Text style={{ color: theme.colors.primary }}>
            { strings.fundDetailsScreen.change }
          </Text>
          <Text style={ styles[changePercentage < 0 ? "negativeValue" : "positiveValue"] }>
            { Calculations.formatPercentageNumberStr(new BigNumber(changePercentage)) }
          </Text>
        </View>
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <TouchableOpacity onPress={ onClick } style={ styles.cardWrapper }>
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
        <View style={ styles.shareRow }>
          { renderMyShares() }
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PortfolioSecurityCard;