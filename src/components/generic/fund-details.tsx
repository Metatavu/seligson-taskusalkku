import React from "react";
import { View, Text, Platform, Linking } from "react-native";
import { Button, ProgressBar, useTheme } from "react-native-paper";
import fundDetailsStyles from "../../styles/generic/fund-details";
import strings from "../../localization/strings";
import { Fund } from "../../generated/client/models/Fund";
import { useAppSelector } from "../../app/hooks";
import { selectSelectedLanguage } from "../../features/locale/locale-slice";
import { LocalizedValue } from "../../generated/client";
import { selectAuth } from "../../features/auth/auth-slice";
import GenericUtils from "../../utils/generic";
import Calculations from "../../utils/calculations";
import { Currency } from "../../types";

/**
 * Component properties
 */
interface Props {
  fund: Fund;
  currency?: Currency;
  onSubscribePress: () => void;
}

/**
 * Fund details component
 *
 * @param props component properties
 */
const FundDetails: React.FC<Props> = ({ fund, currency, onSubscribePress }) => {
  const { color, aShareValue, bShareValue } = fund;
  const auth = useAppSelector(selectAuth);
  const theme = useTheme();
  const styles = fundDetailsStyles(theme, color || "#fff");
  const selectedLanguage = useAppSelector(selectSelectedLanguage);

  /**
   * Returns share display value
   *
   * @param shareValue share value
   * @param currencyValue currency value
   */
  const getShareDisplayValue = (shareValue: string | undefined, currencyValue: Currency) => (
    shareValue ? Calculations.formatCurrency(shareValue, currencyValue, 3) : "-"
  );

  /**
   * Returns whether buy button should be disabled or not
   * 
   * @returns whether buy button should be disabled or not
   */
  const isBuyDisabled = () => !fund.subscriptionBankAccounts?.length;

  /**
   * Event handler for on brochure download press
   */
  const onBrochureDownload = async () => {
    if (!fund.kIID) {
      return;
    }

    Platform.OS === "android" ?
      GenericUtils.openFileAndroid(`https://${fund.kIID[selectedLanguage as keyof LocalizedValue]}`) :
      Linking.openURL(`https://${fund.kIID[selectedLanguage as keyof LocalizedValue]}`);
  };

  /**
   * Renders action buttons
   */
  const renderActionButtons = () => (
    <>
      <View style={ styles.buttonRow }>
        { auth &&
          <Button
            disabled={ isBuyDisabled() && fund.subscribable }
            uppercase={ false }
            style={ styles.button }
            onPress={ onSubscribePress }
          >
            { strings.fundDetailsScreen.buyFund }
          </Button>
        }
        <Button
          disabled={ !fund.kIID }
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
   * Renders share values
   *
   * @param currency currency value
   */
  const renderShareValues = (currencyValue?: string) => {
    if (!currencyValue) {
      return (
        <View
          style={{
            width: "100%",
            height: 20,
            justifyContent: "center"
          }}
        >
          <ProgressBar
            indeterminate
            color={ theme.colors.primary }
          />
        </View>
      );
    }

    return (
      <>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ ...theme.fonts.medium, marginRight: theme.spacing(0.5) }}>
            { strings.fundDetailsScreen.aShare }
          </Text>
          <Text style={ theme.fonts.medium }>
            { getShareDisplayValue(aShareValue, currencyValue as Currency) }
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ ...theme.fonts.medium, marginRight: theme.spacing(0.5) }}>
            { strings.fundDetailsScreen.bShare }
          </Text>
          <Text style={ theme.fonts.medium }>
            { getShareDisplayValue(bShareValue, currencyValue as Currency) }
          </Text>
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
        <View style={[ styles.gradientContainer, { backgroundColor: fund.color } ]}/>
        <View style={ styles.cardContent }>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: theme.spacing(1)
            }}
          >
            { renderShareValues(currency) }
          </View>
        </View>
      </View>
      { renderActionButtons() }
    </>
  );
};

export default FundDetails;