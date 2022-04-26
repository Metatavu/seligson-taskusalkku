import React from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import styles from "../../../styles/screens/portfolio/company-select";
import { CompanyContext } from "../../providers/company-provider";

const CONTAINER_HEIGHT = 48;

/**
 * Company select component
 */
const CompanySelect: React.FC = () => {
  const { selectedCompany, onChange, companies } = React.useContext(CompanyContext);
  const [ showDropDown, setShowDropDown ] = React.useState(false);

  /**
   * Event handler for select value change
   *
   * @param value value from DropDown
   */
  const onSelectValueChange = (value: any) => {
    const companyId = value as string;
    onChange(companies?.find(company => company.id === companyId));
  };

  if (!companies?.length) {
    return null;
  }

  if (companies.length === 1) {
    return (
      <View style={ styles.root }>
        <View style={{ height: CONTAINER_HEIGHT, justifyContent: "center" }}>
          <Text style={ styles.singleCompanyText }>
            { companies[0].name }
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
        list={(companies || []).map(company => ({ label: company.name || "", value: company.id || "" }))}
        onDismiss={ () => setShowDropDown(false) }
        value={ selectedCompany?.id || "" }
        setValue={ onSelectValueChange }
        showDropDown={ () => setShowDropDown(true) }
        visible={ showDropDown }
        mode="flat"
        dropDownContainerMaxHeight={ 500 }
        inputProps={{
          render: ({ value }) => (
            <View style={{ height: CONTAINER_HEIGHT, justifyContent: "center" }}>
              <Text style={ styles.companySelectInputText }>
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

export default CompanySelect;