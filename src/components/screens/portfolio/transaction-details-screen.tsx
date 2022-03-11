import React from "react";
import { View, Text, Platform } from "react-native";
import theme from "../../../theme";
import { Divider } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/portfolio/transactions-details-screen";
import GenericUtils from "../../../utils/generic";
import { Security, TransactionType } from "../../../generated/client";
import BigNumber from "bignumber.js";
import Calculations from "../../../utils/calculations";
import BackButton from "../../generic/back-button";
import DateUtils from "../../../utils/date-utils";
import PortfolioNavigator from "../../../types/navigators/portfolio";
import { useHardwareGoBack } from "../../../app/hooks";
import { SecuritiesApiContext } from "../../providers/securities-api-provider";
import { ErrorContext } from "../../error-handler/error-handler";

/**
 * Type for detail row
 */
type DetailRow = {
  label: string;
  value?: string;
};

/**
 * Transaction details screen component
 */
const TransactionDetailsScreen: React.FC = () => {
  useHardwareGoBack();
  const errorContext = React.useContext(ErrorContext);
  const securitiesApiContext = React.useContext(SecuritiesApiContext);
  const { params } = useRoute<PortfolioNavigator.RouteProps<"transactionsDetails">>();
  const localized = strings.portfolio.transactions;
  const [ targetSecurity, setTargetSecurity ] = React.useState<Security>();

  if (!params) {
    return null;
  }

  const { fund, security, portfolioTransaction } = params;
  const { name } = security;
  const { transactionType, valueDate, paymentDate, provision, shareAmount, marketValue, totalValue, targetSecurityId } = portfolioTransaction;

  /**
   * Loads target security if needed
   */
  const loadTargetSecurity = async () => {
    if (!targetSecurityId) return;

    try {
      setTargetSecurity(await securitiesApiContext.findSecurity({ securityId: targetSecurityId }));
    } catch (error) {
      errorContext.setError(strings.errorHandling.transactionDetails.find, error);
    }
  };

  /**
   * Effect to load target security if needed
   */
  React.useEffect(() => { loadTargetSecurity(); }, []);

  /**
   * Returns target security row or undefined if target security is not present
   *
   * @param target target security
   */
  const getTargetSecurityRow = (target?: Security): DetailRow | undefined => (
    target ? {
      label: strings.portfolio.transactions.security,
      value: GenericUtils.getLocalizedValue(target.name)
    } : undefined
  );

  /**
   *
   * Render details row
   *
   * @param detailRow detail row
   */
  const renderDetailsRow = (detailRow?: DetailRow) => {
    const { label, value } = detailRow || {};

    return (
      <View key={ label } style={ styles.detailsRow }>
        <Text style={ theme.fonts.medium }>
          { label }
        </Text>
        <Text>
          { value }
        </Text>
      </View>
    );
  };

  /**
   * Renders detail rows
   */
  const renderDetailRows = () => {
    const transactionDisplayType = localized[transactionType.toLowerCase() as keyof typeof localized];
    const paidTotal = new BigNumber(totalValue);
    
    /**
     * Total value by transaction type
     */
    const totalValueByTransactionType = () => {
      if (transactionType === "SUBSCRIPTION") {
        return new BigNumber(Number(totalValue) - Number(provision));
      }

      if (transactionType === "REDEMPTION") {
        return new BigNumber(Number(totalValue) + Number(provision));
      }

      return new BigNumber(totalValue);
    };

    const rows: (DetailRow | undefined)[] = [
      {
        label: localized.type,
        value: transactionDisplayType
      },
      getTargetSecurityRow(targetSecurity),
      {
        label: localized.valueDate,
        value: DateUtils.formatToFinnishDate(valueDate)
      },
      {
        label: localized.paymentDate,
        value: paymentDate ? DateUtils.formatToFinnishDate(paymentDate) : undefined
      },
      {
        label: strings.fundDetailsScreen.amount,
        value: Calculations.formatNumberStr(shareAmount, 4, { suffix: ` ${strings.portfolio.transactions.shareAmount}` })
      },
      {
        label: localized.value,
        value: Calculations.formatEuroNumberStr(marketValue, 4)
      },
      {
        label: localized.totalValue,
        value: Calculations.formatEuroNumberStr(totalValueByTransactionType())
      },
      {
        label: localized.provision,
        value: Calculations.formatEuroNumberStr(provision)
      },
      {
        label: localized.paidTotal,
        value: Calculations.formatEuroNumberStr(paidTotal)
      }
    ];

    return rows.map(renderDetailsRow);
  };

  /**
   * Component render
   */
  return (
    <View style={ styles.detailsScreen }>
      { Platform.OS === "ios" && <BackButton/> }
      <View style={ styles.cardWrapper }>
        <View style={[ styles.gradientContainer, { backgroundColor: fund.color } ]}/>
        <View style={ styles.detailsWrapper }>
          <Text style={[ theme.fonts.medium, styles.transactionTitle ]}>
            { GenericUtils.getLocalizedValue(name) }
          </Text>
          <Divider style={{ marginVertical: 5 }}/>
          { renderDetailRows() }
        </View>
      </View>
    </View>
  );
};

export default TransactionDetailsScreen;