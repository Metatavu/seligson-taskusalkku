import React from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { Portfolio } from "../../../generated/client";
import styles from "../../../styles/screens/portfolio/company-select";
import { CompanyContext } from "../../providers/company-provider";
import { PortfolioContext } from "../../providers/portfolio-provider";

const CONTAINER_HEIGHT = 48;

/**
 * Component properties
 */
interface Props {
  loading?: boolean;
}

/**
 * Company select component
 */
const CompanySelect: React.FC<Props> = ({ loading }) => {
  const { saveHistoryValues } = React.useContext(PortfolioContext);
  const { selectedCompany, onChange, companies } = React.useContext(CompanyContext);
  const [ showDropDown, setShowDropDown ] = React.useState(false);
  const { portfolios, getCompanyPortfolios } = React.useContext(PortfolioContext);
  const [ companyPortfolios, setCompanyPortfolios ] = React.useState<Portfolio[]>([]);

  React.useEffect(() => {
    setCompanyPortfolios(getCompanyPortfolios(selectedCompany));
  }, [ selectedCompany, portfolios, companies ]);

  /**
   * Event handler for select value change
   *
   * @param value value from DropDown
   */
  const onSelectValueChange = (value: any) => {
    const companyId = value as string;
    const foundCompany = companies?.find(company => company.id === companyId);
    saveHistoryValues([]);
    foundCompany && onChange(foundCompany);
  };

  if (!companies?.length || companies.length === 1) {
    if (!companyPortfolios?.length || companyPortfolios.length == 1) {
      return (
        <View style={ styles.root }>
          <View style={{ height: CONTAINER_HEIGHT, justifyContent: "center" }}>
            <Text style={ styles.singleCompanyText }>
              { (companies && companies[0].name) ? companies[0]?.name : "" }
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }

  /**
   * Component render
   */
  return (
    <View style={ styles.root }>
      <DropDown
        list={ (companies || []).map(company => ({ label: company.name || "", value: company.id || "" })) }
        onDismiss={ () => setShowDropDown(false) }
        value={ selectedCompany?.id || "" }
        setValue={ onSelectValueChange }
        showDropDown={ () => !loading && setShowDropDown(true) }
        visible={ showDropDown }
        mode="flat"
        dropDownContainerMaxHeight={ 500 }
        inputProps={{
          render: ({ value }) => (
            <View style={{ height: CONTAINER_HEIGHT, justifyContent: "center" }}>
              <Text style={[ styles.companySelectInputText, loading && { opacity: 0.5 } ]}>
                { value }
              </Text>
            </View>
          ),
          right: <TextInput.Icon name="account" color="white" style={ loading && { opacity: 0.5 } }/>,
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

export default CompanySelect;