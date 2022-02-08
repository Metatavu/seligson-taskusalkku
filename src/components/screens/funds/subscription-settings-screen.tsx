import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TextInput } from "react-native";
import { Card, Button, useTheme, Snackbar, Divider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import FundsNavigator from "../../../types/navigators/funds";
import styles from "../../../styles/screens/funds/subscription-settings";
import theme from "../../../theme";
import strings from "../../../localization/strings";
import GenericUtils from "../../../utils/generic";
import { PORTFOLIO_REFERENCE_TYPE, SubscriptionOption, SubscriptionSettings } from "../../../types";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";
import { TouchableOpacity } from "react-native-gesture-handler";
import BasicModal from "../../generic/basic-modal";
import RadioButtonOptionItem from "../../generic/radio-button-option-item";
import produce from "immer";
import { Portfolio } from "../../../generated/client";
import Icon from "react-native-vector-icons/FontAwesome";
import DatePicker from "../../generic/date-picker";
import CopyText from "../../generic/copy-text";
import BackButton from "../../generic/back-button";

/**
 * Subscription settings screen component
 *
 * @param props component properties
 */
const SubscriptionSettingsScreen: React.FC = () => {
  const navigation = useNavigation<FundsNavigator.NavigationProps>();
  const { params } = useRoute<FundsNavigator.RouteProps<"fundSubscriptionSettings">>();
  const { fund } = params;
  const { colors } = useTheme();
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const errorContext = React.useContext(ErrorContext);

  const [ snackBarOpen, setSnackBarOpen ] = React.useState(false);
  const [ bankOptionVisible, setBankOptionVisible ] = React.useState(false);
  const [ portfolioOptionVisible, setPortfolioOptionVisible ] = React.useState(false);
  const [ referenceOptionVisible, setReferenceOptionVisible ] = React.useState(false);
  const [ portfolioOptions, setPortfolioOptions ] = React.useState<SubscriptionOption[]>([]);
  const [ bankOptions, setBankOptions ] = React.useState<SubscriptionOption[]>([]);
  const [ referenceOptions, setReferenceOptions ] = React.useState<SubscriptionOption[]>([]);
  const [ portfolios, setPortfolios ] = React.useState<Portfolio[]>([]);
  const [ subscriptionSettings, setSubscriptionSettings ] = React.useState<SubscriptionSettings>({
    fund: fund,
    dueDate: new Date(),
    shareType: PORTFOLIO_REFERENCE_TYPE.A,
    sum: "0"
  });

  /**
   * Reference options select handler
   * 
   * @param bankOption bank option
   */
  const onBankOptionSelect = (bankOption: SubscriptionOption) => {
    const updatedSubscriptionSettings = produce(subscriptionSettings, draft => {
      draft.bankName = bankOption.label;
      draft.iBAN = bankOption.value;
    });

    setSubscriptionSettings(updatedSubscriptionSettings);
    setBankOptionVisible(false);
  };

  /**
   * Reference options select handler
   * 
   * @param referenceOption reference option
   */
  const onReferenceOptionSelect = (referenceOption: SubscriptionOption) => {
    const updatedSubscriptionSettings = produce(subscriptionSettings, draft => {
      draft.referenceNumber = referenceOption.value;
      draft.shareType = referenceOption.key as PORTFOLIO_REFERENCE_TYPE;
    });

    setSubscriptionSettings(updatedSubscriptionSettings);
    setReferenceOptionVisible(false);
  };

  /**
   * Portfolio select handler
   * 
   * @param portfolioOption portfolio option
   */
  const onPortfolioOptionSelect = (portfolioOption: SubscriptionOption) => {
    const foundPortfolio = portfolios.find(p => p.id === portfolioOption.key);
    if (!foundPortfolio) {
      return;
    }

    const updatedSubscriptionSettings = produce(subscriptionSettings, draft => {
      draft.portfolio = foundPortfolio;
    });

    setSubscriptionSettings(updatedSubscriptionSettings);
    setPortfolioOptionVisible(false);
  };

  /**
   * Update reference options handler
   * 
   * @param portfolio portfolio
   */
  const updateReferenceOptions = (portfolio: Portfolio) => {
    const options: SubscriptionOption[] = [
      {
        label: strings.subscription.shares.a.title,
        description: strings.subscription.shares.a.description,
        key: PORTFOLIO_REFERENCE_TYPE.A,
        value: portfolio.aReference || ""
      },
      {
        label: strings.subscription.shares.b.title,
        description: strings.subscription.shares.b.description,
        key: PORTFOLIO_REFERENCE_TYPE.B,
        value: portfolio.bReference || ""
      }
    ];

    setReferenceOptions(options);
    onReferenceOptionSelect(options[0]);
  };

  /**
   * Select default options
   * 
   * @param bankOption bank option
   * @param portfolio portfolio
   */
  const SelectDefaultOptions = (bankOption?: SubscriptionOption, portfolio?: Portfolio) => {
    const updatedSubscriptionSettings = produce(subscriptionSettings, draft => {
      draft.bankName = bankOption?.label;
      draft.iBAN = bankOption?.value;
      draft.portfolio = portfolio;
    });

    setSubscriptionSettings(updatedSubscriptionSettings);
  };

  /**
   * Loads data
   */
  const loadData = async () => {
    try {
      const fetchedPortfolios = await portfoliosApiContext.listPortfolios();

      setPortfolios(fetchedPortfolios);
      const fetchedPortfolioOptions: SubscriptionOption[] = fetchedPortfolios.map(portfolio => ({
        key: portfolio.id || "",
        label: portfolio.name,
        value: portfolio.name
      }));

      setPortfolioOptions(fetchedPortfolioOptions);

      const fundBankOptions: SubscriptionOption[] = fund.subscriptionBankAccounts?.map(subscriptionBankAccount => ({
        key: subscriptionBankAccount.iBAN || "",
        label: subscriptionBankAccount.bankAccountName?.split("/ ")[1] || "",
        value: subscriptionBankAccount.iBAN || ""
      })) || [];

      setBankOptions(fundBankOptions);
      SelectDefaultOptions(fundBankOptions[0], fetchedPortfolios[0]);
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
    subscriptionSettings.portfolio && updateReferenceOptions(subscriptionSettings.portfolio);
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

    navigation.navigate("fundSubscriptionSummary", { subscriptionSettings: subscriptionSettings });
  };

  /**
   * Renders fund title
   */
  const renderFundTitle = () => (
    <>
      <View style={ styles.fundTitleContainer }>
        <View style={{ ...styles.fundColor, backgroundColor: fund.color }}/>
        <Text style={[ theme.fonts.medium, styles.fundTitle ]}>
          { subscriptionSettings.fund.longName ? GenericUtils.getLocalizedValue(subscriptionSettings.fund.longName) : "" }
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
          <Text>
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
      <Text style={ styles.primaryLabel }>
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
   * Renders sum input
  */
  const renderSumInput = () => (
    <View style={{ flexDirection: "column" }}>
      <Text style={{ color: "red" }}>
        { !validNumber(subscriptionSettings.sum) && strings.errorHandling.subscription.invalidSum }
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <TextInput
          style={[ { height: 30 }, !validNumber(subscriptionSettings.sum) ? { color: "red" } : { color: "black" } ]}
          value={ subscriptionSettings.sum }
          keyboardType="numeric"
          onChangeText={ onSubscriptionSumChange }
        />
        <Text>
          €
        </Text>
      </View>
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
          strings.subscription.bank,
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
            <Text>
              { strings.subscription.recipient }
            </Text>
          ),
          () => renderCopyText(GenericUtils.getLocalizedValue(fund.name))
        )
      }
      <Divider style={{ marginBottom: theme.spacing(2) }}/>
      {
        renderSelectWithLabel(
          strings.subscription.portfolio,
          portfolioOptionVisible,
          setPortfolioOptionVisible,
          portfolioOptions,
          onPortfolioOptionSelect,
          portfolioOptions.find(option => option.key === subscriptionSettings.portfolio?.id)
        )
      }
      <Divider/>
      {
        renderDataRow(
          () => (
            <Text>
              { strings.subscription.sum }
            </Text>
          ),
          renderSumInput
        )
      }
      <Divider style={{ marginBottom: theme.spacing(2) }}/>
      {
        renderSelectWithLabel(
          strings.subscription.shareType,
          referenceOptionVisible,
          setReferenceOptionVisible,
          referenceOptions,
          onReferenceOptionSelect,
          referenceOptions.find(option => option.key === subscriptionSettings.shareType)
        )
      }
      <Divider/>
      {
        renderDataRow(
          () => (
            <Text>
              { strings.subscription.dueDate }
            </Text>
          ),
          renderDueDatePicker
        )
      }
    </>
  );

  /**
   * Renders fund subscription content
   */
  const renderContent = () => (
    <View style={{ padding: theme.spacing(2), marginBottom: theme.spacing(6) }}>
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
    </View>
  );

  /**
   * Component render
   */
  return (
    <>
      <BackButton/>
      <KeyboardAvoidingView behavior={ Platform.OS === "ios" ? "padding" : "height" }>
        <ScrollView>
          { renderContent() }
        </ScrollView>
      </KeyboardAvoidingView>
      { renderSnackBar() }
    </>
  );
};

export default SubscriptionSettingsScreen;