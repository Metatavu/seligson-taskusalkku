import React from "react";
import { Platform, View, Text, TextInput, Linking, TouchableOpacity } from "react-native";
import { Card, Button, useTheme, Snackbar, Divider } from "react-native-paper";
import { NavigationProp, Route, useNavigation, useRoute } from "@react-navigation/native";
import styles from "../../../styles/screens/funds/subscription-settings";
import theme from "../../../theme";
import strings from "../../../localization/strings";
import GenericUtils from "../../../utils/generic";
import { PORTFOLIO_REFERENCE_TYPE, SubscriptionOption, SubscriptionSettings } from "../../../types";
import { ErrorContext } from "../../error-handler/error-handler";
import BasicModal from "../../generic/basic-modal";
import RadioButtonOptionItem from "../../generic/radio-button-option-item";
import produce from "immer";
import { Fund, Portfolio } from "../../../generated/client";
import Icon from "react-native-vector-icons/FontAwesome";
import DatePicker from "../../generic/date-picker";
import CopyText from "../../generic/copy-text";
import BackButton from "../../generic/back-button";
import { useHardwareGoBack } from "../../../app/hooks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PortfolioContext } from "../../providers/portfolio-provider";

/**
 * Component properties
 */
interface Props {
  onProceed: (
    navigation: NavigationProp<any>,
    subscriptionSettings: SubscriptionSettings
  ) => void;
}

/**
 * Subscription settings screen component
 *
 * @param props component properties
 */
const SubscriptionSettingsScreen: React.FC<Props> = ({ onProceed }) => {
  useHardwareGoBack();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<Route<"", { fund: Fund }>>();
  const { fund } = route.params;
  const { portfolios } = React.useContext(PortfolioContext);
  const errorContext = React.useContext(ErrorContext);

  const [ snackBarOpen, setSnackBarOpen ] = React.useState(false);
  const [ bankOptionVisible, setBankOptionVisible ] = React.useState(false);
  const [ portfolioOptionVisible, setPortfolioOptionVisible ] = React.useState(false);
  const [ portfolioOptions, setPortfolioOptions ] = React.useState<SubscriptionOption[]>([]);
  const [ bankOptions, setBankOptions ] = React.useState<SubscriptionOption[]>([]);
  const [ reference, setReference ] = React.useState<SubscriptionOption>();
  const [ subscriptionSettings, setSubscriptionSettings ] = React.useState<SubscriptionSettings>({
    fund: fund,
    dueDate: new Date(),
    shareType: PORTFOLIO_REFERENCE_TYPE.A,
    sum: ""
  });

  /**
   * Reference options select handler
   *
   * @param bankOption bank option
   */
  const onBankOptionSelect = (bankOption: SubscriptionOption) => {
    setSubscriptionSettings({
      ...subscriptionSettings,
      bankName: bankOption.label,
      iBAN: bankOption.value
    });

    setBankOptionVisible(false);
  };

  /**
   * Portfolio select handler
   *
   * @param portfolioOption portfolio option
   */
  const onPortfolioOptionSelect = (portfolioOption: SubscriptionOption) => {
    const foundPortfolio = (portfolios || []).find(p => p.id === portfolioOption.key);

    if (!foundPortfolio) return;

    setSubscriptionSettings({
      ...subscriptionSettings,
      portfolio: foundPortfolio
    });
    setPortfolioOptionVisible(false);
  };

  /**
   * Update reference handler
   *
   * @param portfolio portfolio
   */
  const updateReference = (portfolio: Portfolio) => {
    setReference({
      label: strings.subscription.shares.a.title,
      description: strings.subscription.shares.a.description,
      key: PORTFOLIO_REFERENCE_TYPE.A,
      value: portfolio.aReference || ""
    });
  };

  /**
   * Select default options
   *
   * @param bankOption bank option
   * @param portfolio portfolio
   */
  const selectDefaultOptions = (bankOption?: SubscriptionOption, portfolio?: Portfolio) => {
    setSubscriptionSettings({
      ...subscriptionSettings,
      bankName: bankOption?.label,
      iBAN: bankOption?.value,
      portfolio: portfolio,
      referenceNumber: portfolio?.aReference
    });
  };

  /**
   * Loads data
   */
  const loadData = async () => {
    try {
      const loadedPortfolioOptions = (portfolios || []).map(portfolio => ({
        key: portfolio.id || "",
        label: portfolio.name,
        value: portfolio.name
      }));

      setPortfolioOptions(loadedPortfolioOptions);

      const fundBankOptions = (fund.subscriptionBankAccounts || []).reduce<SubscriptionOption[]>((options, { iBAN, bankAccountName }) => {
        const bankName = bankAccountName?.split("/ ")[1];

        if (iBAN && bankName) {
          options.push({
            key: iBAN,
            label: strings.subscription.bankNames[bankName as keyof typeof strings.subscription.bankNames] || "",
            value: iBAN
          });
        }

        return options;
      }, []);

      setBankOptions(fundBankOptions);
      selectDefaultOptions(fundBankOptions[0], (portfolios || [])[0]);
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }
  };

  /**
   * Effect for loading data
   */
  React.useEffect(() => { loadData(); }, []);

  /**
   * Effect for updating reference options
   */
  React.useEffect(() => {
    subscriptionSettings.portfolio && updateReference(subscriptionSettings.portfolio);
  }, [ subscriptionSettings.portfolio ]);

  /**
   * On subscription sum change handler
   *
   * @param sum sum
   */
  const onSubscriptionSumChange = (sum: string) => {
    const updatedSubscriptionSettings = produce(subscriptionSettings, draft => {
      draft.sum = sum;
    });

    setSubscriptionSettings(updatedSubscriptionSettings);
  };

  /**
   * On subscription due date change handler
   *
   * @param date date
   */
  const onSubscriptionDueDateChange = (date: Date) => {
    const updatedSubscriptionSettings = produce(subscriptionSettings, draft => {
      draft.dueDate = date;
    });

    setSubscriptionSettings(updatedSubscriptionSettings);
  };

  /**
   * Checks if given number is valid
   *
   * @param number number to check
   */
  const validNumber = (number: string) => new RegExp("^[1-9]\\d*(\\.\\d+)?$").test(number) && Number(number) >= 10;

  /**
   * Validates settings
   */
  const validateSettings = () => (
    !!subscriptionSettings.portfolio &&
    !!subscriptionSettings.iBAN &&
    !!subscriptionSettings.referenceNumber &&
    validNumber(subscriptionSettings.sum)
  );

  /**
   * On create barcode handler
   */
  const onCreateBarCode = () => {
    const { sum } = subscriptionSettings;

    if (!validNumber(sum)) {
      errorContext.setError(strings.errorHandling.subscription.invalidSum);
      return;
    }

    onProceed(navigation, subscriptionSettings);
  };

  /**
   * Renders fund title
   */
  const renderFundTitle = () => (
    <>
      <View style={ styles.fundTitleContainer }>
        <View style={{ ...styles.fundColor, backgroundColor: fund.color }}/>
        <Text style={[ theme.fonts.medium, styles.fundTitle ]}>
          { GenericUtils.getLocalizedValue(subscriptionSettings.fund.shortName) }
        </Text>
      </View>
    </>
  );

  /**
   * Renders select
   *
   * @param visible visible
   * @param setVisible set visible
   * @param options options
   * @param selectOption select option
   * @param selectedOption selected option
   */
  const renderSelect = (
    visible: boolean,
    setVisible: (visible: boolean) => void,
    options: SubscriptionOption[],
    selectOption: (option: SubscriptionOption) => void,
    selectedOption?: SubscriptionOption
  ) => (
    <>
      <TouchableOpacity onPress={ () => setVisible(true) }>
        <View style={ styles.select }>
          <Text style={[ theme.fonts.medium, { marginRight: theme.spacing(1) } ]}>
            { selectedOption?.label }
          </Text>
          <Icon name="chevron-down" color={ colors.primary }/>
        </View>
      </TouchableOpacity>
      <BasicModal
        visible={ visible }
        close={ () => setVisible(false) }
      >
        <View>
          {
            options.map(option => (
              <RadioButtonOptionItem
                style={{ width: "100%" }}
                key={ option.key || "" }
                label={
                  option?.key === PORTFOLIO_REFERENCE_TYPE.A ?
                    `${option?.label} (${strings.subscription.shares.a.recommended})` :
                    option?.label
                }
                value={ option.value }
                checked={ selectedOption?.key === option.key }
                onPress={ () => selectOption(option) }
                description={ option.description }
              />
            ))
          }
        </View>
      </BasicModal>
    </>
  );

  /**
   * Renders copy text
   *
   * @param text text
   */
  const renderCopyText = (text: string) => (
    <CopyText
      text={ text }
      width={ 180 }
      callback={ () => setSnackBarOpen(true) }
    />
  );

  /**
   * Render snack bar
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
   * Renders data row
   *
   * @param renderLabel label renderer
   * @param renderContent content renderer
   */
  const renderDataRow = (renderLabel: () => React.ReactNode, renderContent: () => React.ReactNode) => (
    <>
      <View style={ styles.dataRow }>
        { renderLabel() }
        { renderContent() }
      </View>
    </>
  );

  /**
   * Renders select with label
   *
   * @param label label
   * @param visible visible
   * @param setVisible set visible
   * @param options options
   * @param selectOption select option
   * @param selectedOption selected option
   */
  const renderSelectWithLabel = (
    label: string,
    visible: boolean,
    setVisible: (visible: boolean) => void,
    options: SubscriptionOption[],
    selectOption: (option: SubscriptionOption) => void,
    selectedOption?: SubscriptionOption
  ) => (
    <>
      <Text style={[ theme.fonts.medium, { color: theme.colors.primary } ]}>
        { label }
      </Text>
      {
        renderDataRow(
          () => renderSelect(
            visible,
            setVisible,
            options,
            selectOption,
            selectedOption
          ),
          () => renderCopyText(selectedOption?.value || "")
        )
      }
    </>
  );

  /**
   * Renders Portfolio select with label
   *
   * @param label label
   * @param visible visible
   * @param setVisible set visible
   */
  const renderSelectPortfolioWithLabel = (
    label: string,
    visible: boolean,
    setVisible: (visible: boolean) => void
  ) => (
    <>
      <Text style={[ theme.fonts.medium, { color: theme.colors.primary } ]}>
        { label }
      </Text>
      <View style={{ paddingVertical: theme.spacing(2) }}>
        {
          renderSelect(
            visible,
            setVisible,
            portfolioOptions,
            onPortfolioOptionSelect,
            portfolioOptions.find(option => option.key === subscriptionSettings.portfolio?.id)
          )
        }
      </View>
    </>
  );

  /**
   * Renders sum input
  */
  const renderSumInput = () => (
    <View style={ styles.sumInput } >
      <View style={ styles.sumTextInput }>
        <TextInput
          style={[ styles.sumText, { color: !validNumber(subscriptionSettings.sum) ? "red" : "black" } ]}
          value={ subscriptionSettings.sum }
          keyboardType="numeric"
          onChangeText={ onSubscriptionSumChange }
          placeholder="0"
        />
      </View>
      <Text>
        €
      </Text>
    </View>
  );

  /**
   * Renders due date picker
   */
  const renderDueDatePicker = () => (
    <DatePicker
      mode="date"
      date={ subscriptionSettings.dueDate }
      startDate={ new Date() }
      onDateChange={ onSubscriptionDueDateChange }
    />
  );

  /**
   * Renders fund subscription settings content
   */
  const renderSettingsContent = () => (
    <>
      {
        renderSelectWithLabel(
          strings.subscription.accountNumber,
          bankOptionVisible,
          setBankOptionVisible,
          bankOptions,
          onBankOptionSelect,
          bankOptions.find(option => option.key === subscriptionSettings.iBAN)
        )
      }
      <Divider/>
      {
        renderDataRow(
          () => (
            <Text style={ theme.fonts.medium }>
              { strings.subscription.recipient }
            </Text>
          ),
          () => renderCopyText(GenericUtils.getLocalizedValue(fund.longName))
        )
      }
      <Divider style={{ marginBottom: theme.spacing(2) }}/>
      {
        renderSelectPortfolioWithLabel(
          strings.subscription.portfolio,
          portfolioOptionVisible,
          setPortfolioOptionVisible
        )
      }
      <Divider style={{ marginBottom: theme.spacing(2) }}/>
      <Text style={[ theme.fonts.medium, { color: theme.colors.primary } ]}>
        { strings.subscription.referenceNumber }
      </Text>
      {
        renderDataRow(
          () => (
            <Text style={ theme.fonts.medium }>
              { strings.subscription.shares.a.title }
            </Text>
          ),
          () => renderCopyText(reference?.value || "")
        )
      }
      <Divider/>
      {
        renderDataRow(
          () => (
            <Text style={ theme.fonts.medium }>
              { strings.subscription.subscriptionAmount }
            </Text>
          ),
          renderSumInput
        )
      }
      <View
        style={
          !validNumber(subscriptionSettings.sum) && subscriptionSettings.sum.length ?
            styles.validSum :
            styles.invalidSum
        }
      >
        <Text style={{ color: "red" }}>
          { strings.errorHandling.subscription.invalidSum }
        </Text>
      </View>
      <Divider/>
      {
        renderDataRow(
          () => (
            <Text style={ theme.fonts.medium }>
              { strings.subscription.dueDate }
            </Text>
          ),
          renderDueDatePicker
        )
      }
    </>
  );

  /**
   * Renders a subscribable fund
   */
  const renderSubscribableFund = () => (
    <Card style={ styles.subscriptionCard }>
      { renderFundTitle() }
      <Text style={{ marginBottom: theme.spacing(2) }}>
        { strings.subscription.settingsDescription }
      </Text>
      { renderSettingsContent() }
      <Button
        mode="contained"
        disabled={ !validateSettings() }
        icon="barcode"
        labelStyle={{ color: "#fff" }}
        style={ styles.backButton }
        onPress={ onCreateBarCode }
        color={ theme.colors.primary }
      >
        <Text style={{ color: "#fff" }}>
          { strings.subscription.createVirtualBarCode }
        </Text>
      </Button>
    </Card>
  );

  /**
   * Renders a non-subscribable fund
   */
  const renderNonsubscribableFund = () => (
    <Card style={ styles.subscriptionCard }>
      { renderFundTitle() }
      <View>
        <Text>
          { strings.subscription.nonSubscribableFund.description }
        </Text>
        <Text
          onPress={ () => Linking.openURL("https://seligson.fi/resource/rahastosijoittajan_opas.pdf#page=25") }
          style={ styles.linkText }
        >
          { strings.subscription.nonSubscribableFund.guideLink }
        </Text>
        <Text>
          { strings.subscription.nonSubscribableFund.videoBlog }
        </Text>
        <Text
          onPress={ () => Linking.openURL("https://www.seligson.fi/sco/suomi/videoblogi/75/") }
          style={ styles.linkText }
        >
          { strings.subscription.nonSubscribableFund.videoBlogLink }
        </Text>
      </View>
    </Card>
  );

  /**
   * Component render
   */
  return (
    <>
      <KeyboardAwareScrollView>
        { Platform.OS === "ios" && <BackButton/> }
        <View style={{ padding: theme.spacing(2) }}>
          { !fund.subscribable ?
            renderNonsubscribableFund() :
            renderSubscribableFund()
          }
        </View>
      </KeyboardAwareScrollView>
      { renderSnackBar() }
    </>
  );
};

export default SubscriptionSettingsScreen;