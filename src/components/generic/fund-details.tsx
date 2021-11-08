import React from "react";
import { View, Image } from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../theme";
import fundDetailsStyles from "../../styles/generic/fund-details";
import { FundData } from "../../types";

/**
 * Interface describing component properties
 */
interface Props {
  fund: FundData;
}

/**
 * Component for a fund details
 *
 * @param props component properties
 */
const FundDetails: React.FC<Props> = ({ fund }) => {
  const styles = fundDetailsStyles(useTheme());
  const { color, aShare, bShare, lahiTapiola } = fund;

  /**
   * Component for own share
   *
   * @param label price history label
   * @param value price history percentage
   */
  const renderOwnShare = (label: string, value: number) => {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text>
          { label }
        </Text>
        <Text style={ styles.priceHistoryPercentage } >
          { value }
          { label === "Muutos" ? ("%") : null }
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={ theme.fonts.medium }>
              { "A-osuus: " }
              { aShare }
            </Text>
          </View>
          <View>
            <Text style={ theme.fonts.medium }>
              { "B-osuus: " }
              { bShare }
            </Text>
          </View>
        </View>
        <Divider style={{ marginVertical: 5 }}/>
        <View style={ styles.cardRow }>
          <Text style={ theme.fonts.medium }>
            { "Omat osuudet: " }
          </Text>
          { renderOwnShare("Kpl", 10) }
          { renderOwnShare("Arvo", Number(aShare * 10)) }
          { renderOwnShare("Muutos", 25) }
        </View>
      </View>
      <Button
        uppercase={ false }
        style={ styles.button }
      >
        Tee rahastomerkintä
      </Button>
      <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
        {lahiTapiola ? (
          <Image
            // eslint-disable-next-line global-require
            source={ require("../../../assets/ltLogoWide.png") }
            resizeMode="contain"
            style={ styles.logoWide }
          />
        ) : null}
        <Button
          icon="download"
          uppercase={ false }
          style={ styles.button }
        >
          Avaintietoesite
        </Button>
      </View>
    </View>
  );
};

export default FundDetails;