import React from "react";
import { View, Text } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../theme";
import fundDetailsStyles from "../../styles/generic/fund-details";
import strings from "../../localization/strings";
import { Fund } from "../../generated/client/models/Fund";
import { useAppSelector } from "../../app/hooks";
import { selectSelectedLanguage } from "../../features/locale/locale-slice";
import { LocalizedValue } from "../../generated/client";
import { selectAuth } from "../../features/auth/auth-slice";
import GenericUtils from "../../utils/generic";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
  onSubscribePress: () => void;
}

/**
 * Fund details component
 *
 * @param props component properties
 */
const FundDetails: React.FC<Props> = ({ fund, onSubscribePress }) => {
  const { color, aShareValue, bShareValue } = fund;
  const auth = useAppSelector(selectAuth);
  const styles = fundDetailsStyles(useTheme(), color || "#fff");
  const selectedLanguage = useAppSelector(selectSelectedLanguage);

  /**
   * Event handler for on brochure download press
   */
  const onBrochureDownload = async () => {
    if (!fund.kIID) {
      return;
    }

    GenericUtils.openFileAndroid(`https://${fund.kIID[selectedLanguage as keyof LocalizedValue]}`);
  };

  /**
   * Renders my share
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
        <Text style={ styles.priceHistoryPercentage }>
          { value.toFixed(4) }
          { label === strings.fundDetailsScreen.change ? "%" : null }
        </Text>
      </View>
    );
  };

  /**
   * Renders action buttons
   */
  const renderActionButtons = () => (
    <>
      <View style={ styles.buttonRow }>
        { auth &&
          <Button
            uppercase={ false }
            style={ styles.button }
            onPress={ onSubscribePress }
          >
            { strings.fundDetailsScreen.buyFund }
          </Button>
        }
        {/* {lahiTapiola ? (
          <Image
          // eslint-disable-next-line global-require
            source={ require("../../../assets/lt-logo-wide.png") }
            resizeMode="contain"
            style={ styles.logoWide }
          />
        ) : null} */}
        <Button
          icon="download"
          uppercase={ false }
          style={ styles.button }
          onPress={ onBrochureDownload }
        >
          { strings.fundDetailsScreen.downloadBrochure }
        </Button>
      </View>
    </>
  );

  /**
   * Component render
   */
  return (
    <>
      <View style={ styles.cardWrapper }>
        <View style={ styles.gradientContainer }>
          <LinearGradient
            colors={[ "transparent", "rgba(0,0,0,0.5)" ]}
            style={ styles.gradient }
          />
        </View>
        <View style={ styles.cardContent }>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: theme.spacing(1)
            }}
          >
            <View>
              <Text style={ theme.fonts.medium }>
                { `${strings.fundDetailsScreen.aShare} ${aShareValue}€` }
              </Text>
            </View>
            <View>
              <Text style={ theme.fonts.medium }>
                { `${strings.fundDetailsScreen.bShare} ${bShareValue || "-"}€` }
              </Text>
            </View>
          </View>
          {/* <Divider style={{ marginVertical: 5 }}/>
          <View style={ styles.cardRow }>
            <Text style={ theme.fonts.medium }>
              { strings.fundDetailsScreen.myShare }
            </Text>
            { renderMyShare(strings.fundDetailsScreen.amount, 10) }
            { aShareValue && renderMyShare(strings.fundDetailsScreen.value, Number(aShareValue) * 10) }
            { renderMyShare(strings.fundDetailsScreen.change, 25) }
          </View> */}
        </View>
      </View>
      { renderActionButtons() }
    </>
  );
};

export default FundDetails;