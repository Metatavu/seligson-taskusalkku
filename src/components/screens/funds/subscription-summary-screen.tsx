import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from "react-native";
import styles from "../../../styles/screens/funds/subscription-summary";
import { Fund } from "../../../generated/client/models/Fund";
import { useNavigation, useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import { Divider, Card, Snackbar, useTheme, Button } from "react-native-paper";
import strings from "../../../localization/strings";
import theme from "../../../theme";
import GenericUtils from "../../../utils/generic";
import moment from "moment";
import { PORTFOLIO_REFERENCE_TYPE } from "../../../types";
import CopyText from "../../generic/copy-text";

/**
 * Component properties
 */
interface Props {
  funds: Fund[];
}

/**
 * Subscription summary screen component
 *
 * @param props component properties
 */
const SubscriptionSummaryScreen: React.FC<Props> = () => {
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const { colors } = useTheme();
  const { params } = useRoute<FundsNavigator.RouteProps<"fundSubscriptionSummary">>();
  const { subscriptionSettings } = params;

  const [ snackBarOpen, setSnackBarOpen ] = React.useState(false);

  /**
   * Renders fund title
   */
  const renderFundTitle = () => (
    <>
      <View style={ styles.fundTitle }>
        <View
          style={{ ...styles.fundColor, backgroundColor: subscriptionSettings.fund.color }}
        />
        <Text style={{ flexWrap: "wrap" }}>
          { subscriptionSettings.fund.longName ? GenericUtils.getLocalizedValue(subscriptionSettings.fund.longName) : "" }
        </Text>
      </View>
      <Divider/>
    </>
  );

  /**
   * Renders data row
   * 
   * @param label label
   * @param data data
   */
  const renderDataRow = (label: string, data: string) => (
    <>
      <View style={ styles.dataRow }>
        <Text style={ theme.fonts.medium }>
          { `${label}:` }
        </Text>
        <Text>{ data }</Text>
      </View>
      <Divider/>
    </>
  );

  /**
   * Renders copy text
   * 
   * @param text text
   */
  const renderCopyText = (text: string) => (
    <CopyText
      multiline
      text={ text }
      width={ 180 }
      callback={ () => setSnackBarOpen(true) }
    />
  );

  /**
   * Renders copy text with label
   * 
   * @param label label
   * @param data data
   */
  const renderCopyTextWithLabel = (label: string, text: string) => (
    <View style={{ marginTop: theme.spacing(1.5), marginBottom: theme.spacing(1.5) }}>
      <Text
        style={{
          color: colors.primary,
          ...theme.fonts.medium
        }}
      >
        { `${label}:` }
      </Text>
      { renderCopyText(text) }
    </View>
  );

  /**
   * Renders snack bar
   */
  const renderSnackBar = () => (
    <Snackbar
      visible={ snackBarOpen }
      onDismiss={ () => setSnackBarOpen(false) }
      action={{
        label: strings.generic.close,
        color: colors.primary,
        onPress: () => setSnackBarOpen(false)
      }}
    >
      { strings.generic.copied }
    </Snackbar>
  );

  /**
   * Renders fund title
   */
  const renderSummaryContent = () => (
    <>
      {
        renderDataRow(
          strings.subscription.portfolio,
          subscriptionSettings.portfolio?.name || ""
        )
      }
      {
        renderDataRow(
          strings.subscription.bank,
          subscriptionSettings.bankName || ""
        )
      }
      {
        renderDataRow(
          strings.subscription.shareType === PORTFOLIO_REFERENCE_TYPE.A ?
            strings.subscription.shares.a.title :
            strings.subscription.shares.b.title,
          subscriptionSettings.shareType || ""
        )
      }
      {
        renderDataRow(
          strings.subscription.dueDate,
          moment(subscriptionSettings.dueDate).format("DD.MM.YYYY") || ""
        )
      }
      {
        renderDataRow(
          strings.subscription.sum,
          `${subscriptionSettings.sum} €` || ""
        )
      }
      {
        renderCopyTextWithLabel(
          strings.subscription.referenceNumber,
          GenericUtils.generateBarCode(subscriptionSettings)
        )
      }
      <Divider/>
      {
        renderCopyTextWithLabel(
          strings.subscription.recipient,
          GenericUtils.getLocalizedValue(subscriptionSettings.fund.name)
        )
      }
    </>
  );

  /**
   * Renders fund subscription content
   */
  const renderContent = () => (
    <View style={{ padding: theme.spacing(2) }}>
      <Card style={ styles.subscriptionCard }>
        { renderFundTitle() }
        <Text>
          { strings.subscription.summaryDescription }
        </Text>
        { renderSummaryContent() }
      </Card>
    </View>
  );

  /**
   * Component render
   */
  return (
    <>
      <Button
        icon="arrow-left-circle"
        onPress={ navigation.goBack }
        labelStyle={{ color: "#fff" }}
        style={ styles.backButton }
      >
        <Text style={{ color: "#fff" }}>
          { strings.generic.back }
        </Text>
      </Button>
      <KeyboardAvoidingView behavior={ Platform.OS === "ios" ? "padding" : "height" }>
        <ScrollView>
          { renderContent() }
        </ScrollView>
      </KeyboardAvoidingView>
      { renderSnackBar() }
    </>
  );
};

export default SubscriptionSummaryScreen;