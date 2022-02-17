import React from "react";
import { View, Text } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import fundCardStyles from "../../styles/generic/fund-card";
import { Fund, PortfolioSecurity } from "../../generated/client";
import strings from "../../localization/strings";
import GenericUtils from "../../utils/generic";
import BigNumber from "bignumber.js";
import Calculations from "../../utils/calculations";
import { useNavigation } from "@react-navigation/native";
import HomeNavigator from "../../types/navigators/home";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateUtils from "../../utils/date-utils";
import { SeligsonLogoSmall } from "../../../assets/seligson-logo";
import LahitapiolaLogoSmall from "../../../assets/lahitapiola-logo";

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
  const { color, risk, priceDate, longName, shortName } = fund;
  const SeligsonFund = (longName && GenericUtils.getLocalizedValue(longName)).includes("Seligson");
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
   * Renders risk meter
   */
  const renderRiskMeter = () => {
    if (!risk) {
      return null;
    }

    const riskLevels = Array.from({ length: 7 }, (_, index) => (
      <View
        key={ index }
        style={ index < risk ? [ styles.riskMeterOn, { backgroundColor: fund.color } ] : styles.riskMeterOff }
      />
    ));

    return (
      <View style={ styles.riskMeterContainer }>
        <View style={ styles.riskMeterBars }>
          { riskLevels }
        </View>
        <Text style={{ color: theme.colors.grey[600] }}>
          { `${strings.fundCard.riskLevel} ${risk}` }
        </Text>
      </View>
    );
  };

  /**
   * Renders title section
   */
  const renderTitle = () => (
    <View style={ styles.cardColumn }>
      <View style={ styles.fundName }>
        <View style={ styles.fundLogoContainer }>
          { SeligsonFund ? <SeligsonLogoSmall/> : <LahitapiolaLogoSmall/> }
        </View>
        <Text style={ theme.fonts.medium }>
          { shortName && GenericUtils.getLocalizedValue(shortName) }
        </Text>
      </View>
      <Divider style={ styles.divider }/>
      <View style={ styles.cardRow }>
        { renderRiskMeter() }
        <Icon name="calendar" size={ 12 } color={ theme.colors.grey[600] }/>
        <Text style={ styles.lastUpdated }>
          { priceDate && DateUtils.formatToFinnishDate(priceDate) }
        </Text>
      </View>
    </View>
  );

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
      <View style={[ styles.gradientContainer, { backgroundColor: fund.color } ]}/>
      <View style={ styles.cardContent }>
        <View style={ styles.cardRow }>
          { renderTitle() }
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