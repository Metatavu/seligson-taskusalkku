import React from "react";
import { View } from "react-native";
import DropDown from "react-native-paper-dropdown";
import { Portfolio } from "../../../generated/client";
import strings from "../../../localization/strings";
import { PortfoliosApiContext } from "../../providers/portfolios-api-provider";
import { PortfolioContext } from "./portfolio-context-provider";
import styles from "../../../styles/screens/portfolio/portfolio-select";

/**
 * Component for portfolio select
 */
const PortfolioSelect: React.FC = () => {
  const portfolioContext = React.useContext(PortfolioContext);
  const portfoliosApiContext = React.useContext(PortfoliosApiContext);

  const [ showDropDown, setShowDropDown ] = React.useState(false);
  const [ portfolios, setPortfolios ] = React.useState<Portfolio[]>([]);

  /**
   * Loads portfolios when component mounts
   */
  const loadPortfolios = async () => {
    setPortfolios(await portfoliosApiContext.listPortfolios());
  };

  /**
   * Effect for loading portfolios
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

    const options = [
      { label: strings.portfolio.select.all, value: "" },
      ...portfolios.map(portfolio => ({ label: portfolio.id || "", value: portfolio.id || "" }))
    ];

    return (
      <DropDown
        list={ options }
        onDismiss={ () => setShowDropDown(false) }
        value={ portfolioContext.selectedPortfolio?.id || "" }
        setValue={ onSelectValueChange }
        showDropDown={ () => setShowDropDown(true) }
        visible={ showDropDown }
        mode="outlined"
        dropDownContainerMaxHeight={ 500 }
        dropDownStyle={{ marginTop: 45 }}
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