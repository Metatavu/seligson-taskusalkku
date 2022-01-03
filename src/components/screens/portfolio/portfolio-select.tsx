import React from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { Portfolio } from "../../../generated/client";
import strings from "../../../localization/strings";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { PortfolioContext } from "../../providers/portfolio-provider";
import styles from "../../../styles/screens/portfolio/portfolio-select";
import { ErrorContext } from "../../error-handler/error-handler";

/**
 * Portfolio select component
 */
const PortfolioSelect: React.FC = () => {
  const portfolioContext = React.useContext(PortfolioContext);
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);
  const errorContext = React.useContext(ErrorContext);

  const [ showDropDown, setShowDropDown ] = React.useState(false);
  const [ portfolios, setPortfolios ] = React.useState<Portfolio[]>([]);

  /**
   * Loads portfolios
   */
  const loadPortfolios = async () => {
    try {
      setPortfolios(await portfoliosApiContext.listPortfolios());
    } catch (error) {
      errorContext.setError(strings.errorHandling.portfolio.list, error);
    }
  };

  /**
   * Effect for loading portfolios when component mounts
   */
  React.useEffect(() => { loadPortfolios(); }, []);

  /**
   * Event handler for select value change
   *
   * @param value value from DropDown
   */
  const onSelectValueChange = (value: any) => {
    const portfolioId = value as string;
    portfolioContext.onChange(portfolios.find(portfolio => portfolio.id === portfolioId));
  };

  /**
   * Renders content
   */
  const renderContent = () => {
    if (!portfolios?.length) {
      return null;
    }

    return (
      <DropDown
        list={[
          { label: strings.portfolio.select.all, value: "" },
          ...portfolios.map(portfolio => ({ label: portfolio.name || "", value: portfolio.id || "" }))
        ]}
        onDismiss={ () => setShowDropDown(false) }
        value={ portfolioContext.selectedPortfolio?.id || "" }
        setValue={ onSelectValueChange }
        showDropDown={ () => setShowDropDown(true) }
        visible={ showDropDown }
        mode="flat"
        dropDownContainerMaxHeight={ 500 }
        inputProps={{
          dense: true,
          render: ({ value }) => (
            <Text
              style={{
                color: "white",
                paddingLeft: 10,
                paddingTop: 10,
                fontSize: 14
              }}
            >
              { value }
            </Text>
          ),
          right: <TextInput.Icon name="tune" color="white"/>,
          style: {
            backgroundColor: "transparent",
            borderColor: "transparent"
          },
          underlineColor: "transparent"
        }}
      />
    );
  };

  /**
   * Component render
   */
  return (
    <View style={ styles.portfolioSelect }>
      { renderContent() }
    </View>
  );
};

export default PortfolioSelect;