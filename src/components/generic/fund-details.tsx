import React from "react";
import { View } from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../theme";
import fundDetailsStyles from "../../styles/generic/fund-details";
import strings from "../../localization/strings";
import { Fund } from "../../generated/client/models/Fund";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
}

/**
 * Fund details
 *
 * @param props component properties
 */
const FundDetails: React.FC<Props> = ({ fund }) => {
  const { color, aShareValue, bShareValue } = fund;
  const styles = fundDetailsStyles(useTheme(), color || "#fff");

  /**
   * My share
   *
   * @param label price history label
   * @param value price history percentage
   */
  const renderMyShare = (label: string, value: number) => {
    return (
      <View style={ styles.shareColumn }>
        <Text>
          { label }
        </Text>
        <Text style={ styles.priceHistoryPercentage } >
          { value }
          { label === strings.fundDetailsScreen.change ? ("%") : null }
        </Text>
      </View>
    );
  };

  /**
   * Button row
   */
  const buttonRow = () => {
    return (
      <>
        <View style={ styles.buttonRow }>
          <Button
            uppercase={ false }
            style={ styles.button }
          >
            { strings.fundDetailsScreen.buyFund }
          </Button>
        </View>
        <View style={ styles.buttonRow }>
          {/* {lahiTapiola ? (
            <Image
            // eslint-disable-next-line global-require
              source={ require("../../../assets/ltLogoWide.png") }
              resizeMode="contain"
              style={ styles.logoWide }
            />
          ) : null} */}
          <Button
            icon="download"
            uppercase={ false }
            style={ styles.button }
          >
            { strings.fundDetailsScreen.downloadBrochure }
          </Button>
        </View>
      </>
    );
  };
    
  /**
   * Component render
   */
  return (
    <>
      <View style={ styles.cardWrapper }>
        <View style={ styles.gradientContainer }>
          <LinearGradient
            colors={ ["transparent", "rgba(0,0,0,0.5)"] }
            style={ styles.gradient }
          />
        </View>
        <View style={ styles.cardContent }>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={ theme.fonts.medium }>
                { strings.fundDetailsScreen.aShare }
                { ": " }
                { aShareValue }
              </Text>
            </View>
            <View>
              <Text style={ theme.fonts.medium }>
                { strings.fundDetailsScreen.bShare }
                { ": " }
                { bShareValue }
              </Text>
            </View>
          </View>
          <Divider style={{ marginVertical: 5 }}/>
          <View style={ styles.cardRow }>
            <Text style={ theme.fonts.medium }>
              { strings.fundDetailsScreen.ownShare }
            </Text>
            { renderOwnShare(strings.fundDetailsScreen.amount, 10) }
            { renderOwnShare(strings.fundDetailsScreen.value, Number(aShareValue || 0 * 10)) }
            { renderOwnShare(strings.fundDetailsScreen.change, 25) }
          </View>
        </View>
      </View>
      { buttonRow() }
    </>
  );
};

export default FundDetails;