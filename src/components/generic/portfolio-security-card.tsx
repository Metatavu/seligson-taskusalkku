import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import fundCardStyles from "../../styles/generic/fund-card";
import { Fund, PortfolioSecurity, Security } from "../../generated/client";
import strings from "../../localization/strings";
import GenericUtils from "../../utils/generic";
import BigNumber from "bignumber.js";
import Calculations from "../../utils/calculations";
import { useNavigation } from "@react-navigation/native";
import DateUtils from "../../utils/date-utils";
import { SeligsonLogoSmall } from "../../../assets/seligson-logo";
import LahitapiolaLogoSmall from "../../../assets/lahitapiola-logo";
import FundUtils from "../../utils/funds";
import PortfolioNavigator from "../../types/navigators/portfolio";

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
  const { color, risk, priceDate, shortName } = fund;
  const seligsonFund = FundUtils.isSeligsonFund(fund);
  const ltFund = FundUtils.isLtFund(fund);
  const theme = useTheme();
  const styles = fundCardStyles(theme, color || "#FFF");
  const navigation = useNavigation<PortfolioNavigator.NavigationProps>();
  const rateDate = portfolioSecurity.rateDate || priceDate;

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
        <Text style={ styles.riskText }>
          { `${strings.fundCard.riskLevel} ${risk}` }
        </Text>
      </View>
    );
  };

  /**
   * Renders logo container if fund is either Seligson fund or LähiTapiola fund
   */
  const logoContainer = () => {
    if (!seligsonFund && !ltFund) {
      return null;
    }

    return (
      <View style={ styles.fundLogoContainer }>
        { seligsonFund && <SeligsonLogoSmall/> }
        { ltFund && <LahitapiolaLogoSmall/> }
      </View>
    );
  };

  /**
   * Renders title section
   */
  const renderTitle = () => (
    <View style={ styles.cardColumn }>
      <View style={ styles.fundName }>
        { logoContainer() }
        <Text style={ theme.fonts.medium }>
          { GenericUtils.getLocalizedValue(shortName) }
        </Text>
      </View>
      <Divider style={ styles.divider }/>
      <View style={ styles.cardRow }>
        { renderRiskMeter() }
        <Icon name="calendar" size={ 12 } color={ theme.colors.grey[600] }/>
        <Text style={ styles.lastUpdated }>
          { rateDate && DateUtils.formatToFinnishDate(rateDate) }
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
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: theme.fonts.medium.fontWeight }}>
          { strings.fundDetailsScreen.myShare }
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
              { Calculations.formatCurrency(totalValue, "EUR") }
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
        </View>
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <TouchableOpacity
      onPress={ () => navigation.navigate("mySecurityDetails", { fund: fund }) }
      style={ styles.cardWrapper }
    >
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