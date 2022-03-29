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

const CONTAINER_HEIGHT = 48;

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

  if (!portfolios?.length) {
    return <View style={{ height: CONTAINER_HEIGHT }}/>;
  }

  if (portfolios.length === 1) {
    return (
      <View style={ styles.root }>
        <View style={{ height: CONTAINER_HEIGHT, justifyContent: "center" }}>
          <Text style={ styles.singlePortfolioText }>
            { portfolios[0].name }
          </Text>
        </View>
      </View>
    );
  }

  /**
   * Component render
   */
  return (
    <View style={ styles.root }>
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
          render: ({ value }) => (
            <View style={{ height: CONTAINER_HEIGHT, justifyContent: "center" }}>
              <Text style={ styles.portfolioSelectInputText }>
                { value }
              </Text>
            </View>
          ),
          right: <TextInput.Icon name="tune" color="white"/>,
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