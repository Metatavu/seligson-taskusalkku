import React from "react";
import { View, Text, Platform } from "react-native";
import theme from "../../../theme";
import { Divider } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/portfolio/transactions-details-screen";
import GenericUtils from "../../../utils/generic";
import { Security } from "../../../generated/client";
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
  detailValue?: string;
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
  const { transactionType, valueDate, paymentDate, provision, shareAmount, marketValue, totalValue, targetSecurityId, value } = portfolioTransaction;

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
   *
   * Render details row
   *
   * @param detailRow detail row
   */
  const renderDetailsRow = (detailRow?: DetailRow) => {
    const { label, detailValue } = detailRow || {};

    return (
      <View key={ label } style={ styles.detailsRow }>
        <Text style={ theme.fonts.medium }>
          { label }
        </Text>
        <Text>
          { detailValue }
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

      if (transactionType === "SECURITY") {
        return new BigNumber(Number(value) + Number(provision));
      }

      return new BigNumber(totalValue);
    };

    const rows: (DetailRow | undefined)[] = [
      {
        label: localized.type,
        detailValue: transactionDisplayType
      },
      {
        label: localized.valueDate,
        detailValue: DateUtils.formatToFinnishDate(valueDate)
      },
      {
        label: localized.paymentDate,
        detailValue: paymentDate ? DateUtils.formatToFinnishDate(paymentDate) : "-"
      },
      {
        label: strings.fundDetailsScreen.amount,
        detailValue: Calculations.formatNumberStr(shareAmount, 4, { suffix: ` ${strings.portfolio.transactions.shareAmount}` })
      },
      {
        label: localized.value,
        detailValue: Calculations.formatEuroNumberStr(marketValue, 4)
      },
      {
        label: localized.totalValue,
        detailValue: Calculations.formatEuroNumberStr(totalValueByTransactionType())
      },
      {
        label: localized.provision,
        detailValue: Calculations.formatEuroNumberStr(provision)
      },
      {
        label: localized.paidTotal,
        detailValue: Calculations.formatEuroNumberStr(paidTotal)
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
            { targetSecurity !== undefined && ` - > ${GenericUtils.getLocalizedValue(targetSecurity?.name).slice(-3)}`}
          </Text>
          <Divider style={{ marginVertical: 5 }}/>
          { renderDetailRows() }
        </View>
      </View>
    </View>
  );
};

export default TransactionDetailsScreen;