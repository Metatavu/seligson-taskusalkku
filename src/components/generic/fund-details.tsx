import React from "react";
import { View, Text } from "react-native";
import { Button, useTheme } from "react-native-paper";
import theme from "../../theme";
import fundDetailsStyles from "../../styles/generic/fund-details";
import strings from "../../localization/strings";
import { Fund } from "../../generated/client/models/Fund";
import { useAppSelector } from "../../app/hooks";
import { selectSelectedLanguage } from "../../features/locale/locale-slice";
import { LocalizedValue } from "../../generated/client";
import { selectAuth } from "../../features/auth/auth-slice";
import GenericUtils from "../../utils/generic";
import Calculations from "../../utils/calculations";

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
        <View style={[ styles.gradientContainer, { backgroundColor: fund.color } ]}/>
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
                { aShareValue && `${strings.fundDetailsScreen.aShare} ${Calculations.formatEuroNumberStr(aShareValue, 3)}` }
              </Text>
            </View>
            <View>
              <Text style={ theme.fonts.medium }>
                { `${strings.fundDetailsScreen.bShare} ${bShareValue ? Calculations.formatEuroNumberStr(bShareValue, 3) : "-€"}` }
              </Text>
            </View>
          </View>
        </View>
      </View>
      { renderActionButtons() }
    </>
  );
};

export default FundDetails;