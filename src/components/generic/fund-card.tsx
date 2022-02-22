import React from "react";
import { View, Text } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import theme from "../../theme";
import fundCardStyles from "../../styles/generic/fund-card";
import { Fund } from "../../generated/client";
import strings from "../../localization/strings";
import GenericUtils from "../../utils/generic";
import Calculations from "../../utils/calculations";
import DateUtils from "../../utils/date-utils";
import { SeligsonLogoSmall } from "../../../assets/seligson-logo";
import LahitapiolaLogoSmall from "../../../assets/lahitapiola-logo";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
}

/**
 * Fund card component
 *
 * @param props component properties
 */
const FundCard: React.FC<Props> = ({ fund }) => {
  const { color, shortName, longName, risk, changeData, priceDate } = fund;
  const { change1d, change1m, change1y, change5y, change20y } = changeData || {};
  const styles = fundCardStyles(useTheme(), color || "#FFF");
  const SeligsonFund = GenericUtils.getLocalizedValue(longName).includes("Seligson");

  /**
   * Component for price history
   *
   * @param label price history label
   * @param percentage price history percentage
   */
  const renderPriceHistory = (label: string, percentage: string) => (
    <View style={ styles.cardColumn }>
      <Text>
        { label }
      </Text>
      <Text style={ styles[Number(percentage) < 0 ? "negativeValue" : "positiveValue"] }>
        { Calculations.formatPercentageNumberStr(percentage) }
      </Text>
    </View>
  );

  /**
   * Renders risk meter
   */
  const renderRiskMeter = () => {
    if (!risk) {
      return null;
    }

    const riskArray = Array.from({ length: 7 }, (_, index) => (
      <View
        key={ index }
        style={ index < risk ? [ styles.riskMeterOn, { backgroundColor: fund.color } ] : styles.riskMeterOff }
      />
    ));

    return (
      <View style={ styles.riskMeterContainer }>
        <View style={ styles.riskMeterBars }>
          { riskArray }
        </View>
        <Text style={ styles.riskText }>
          { `${strings.fundCard.riskLevel} ${risk}` }
        </Text>
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <>
      <View style={[ styles.gradientContainer, { backgroundColor: fund.color } ]}/>
      <View style={ styles.cardContent }>
        <View style={ styles.cardRow }>
          <View style={ styles.cardColumn }>
            <View style={ styles.fundName }>
              <View style={ styles.fundLogoContainer }>
                { SeligsonFund ? <SeligsonLogoSmall/> : <LahitapiolaLogoSmall/> }
              </View>
              <Text style={ theme.fonts.medium }>
                { GenericUtils.getLocalizedValue(shortName) }
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
        </View>
        <Divider style={ styles.divider }/>
        <View style={ styles.cardRow }>
          { change1d && renderPriceHistory(strings.fundCard.historyOneDay, change1d) }
          { change1m && renderPriceHistory(strings.fundCard.historyOneMonth, change1m) }
          { change1y && renderPriceHistory(strings.fundCard.historyOneYear, change1y) }
          { change5y && renderPriceHistory(strings.fundCard.historyFiveYears, change5y) }
          { change20y && renderPriceHistory(strings.fundCard.historyTwentyYears, change20y) }
        </View>
      </View>
    </>
  );
};

export default FundCard;