import React from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import strings from "../../../localization/strings";
import { PortfolioContext } from "../../providers/portfolio-provider";
import styles from "../../../styles/screens/portfolio/portfolio-select";
import { CompanyContext } from "../../providers/company-provider";
import { Portfolio } from "../../../generated/client";

const CONTAINER_HEIGHT = 48;

/**
 * Component properties
 */
interface Props {
  loading?: boolean;
}

/**
 * Portfolio select component
 */
const PortfolioSelect: React.FC<Props> = ({ loading }) => {
  const { selectedCompany, companies } = React.useContext(CompanyContext);
  const { portfolios, onChange, selectedPortfolio, getEffectivePortfolios } = React.useContext(PortfolioContext);
  const [ showDropDown, setShowDropDown ] = React.useState(false);
  const [ effectivePortfolios, setEffectivePortfolios ] = React.useState<Portfolio[]>([]);

  React.useEffect(() => {
    setEffectivePortfolios(getEffectivePortfolios(selectedCompany));
  }, [ selectedCompany, portfolios, companies ]);

  /**
   * Event handler for select value change
   *
   * @param value value from DropDown
   */
  const onSelectValueChange = (value: any) => {
    const portfolioId = value as string;
    onChange((portfolios || []).find(portfolio => portfolio.id === portfolioId));
  };

  if (!effectivePortfolios?.length || effectivePortfolios.length === 1) {
    return null;
  }

  /**
   * Component render
   */
  return (
    <View style={ styles.root }>
      <DropDown
        list={[
          { label: strings.portfolio.select.all, value: "" },
          ...effectivePortfolios.map(portfolio => ({ label: portfolio.name || "", value: portfolio.id || "" }))
        ]}
        onDismiss={ () => setShowDropDown(false) }
        value={ selectedPortfolio?.id || "" }
        setValue={ onSelectValueChange }
        showDropDown={ () => !loading && setShowDropDown(true) }
        visible={ showDropDown }
        mode="flat"
        dropDownContainerMaxHeight={ 500 }
        inputProps={{
          render: ({ value }) => (
            <View style={{ height: CONTAINER_HEIGHT, justifyContent: "center" }}>
              <Text style={[ styles.portfolioSelectInputText, loading && { opacity: 0.5 } ]}>
                { value }
              </Text>
            </View>
          ),
          right: <TextInput.Icon name="tune" color="white" style={ loading && { opacity: 0.5 } }/>,
          style: {
            backgroundColor: "transparent",
            borderColor: "transparent",
            height: CONTAINER_HEIGHT
          },
          underlineColor: "transparent"
        }}
      />
    </View>
  );
};

export default PortfolioSelect;