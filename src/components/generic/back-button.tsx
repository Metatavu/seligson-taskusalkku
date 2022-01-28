import React from "react";
import { Button } from "react-native-paper";
import { View, Text } from "react-native";
import strings from "../../localization/strings";
import styles from "../../styles/generic/back-button";
import { useNavigation } from "@react-navigation/native";
import PublicationsNavigator from "../../types/navigators/publications";

/**
 * Back button component
 */
const BackButton = () => {
  const navigation = useNavigation<PublicationsNavigator.NavigationProps>();

  return (
    <View style={ styles.buttonContainer }>
      <Button
        icon="arrow-left-circle"
        onPress={ navigation.goBack }
        labelStyle={{ color: "#fff" }}
        style={ styles.backButton }
        uppercase={ false }
      >
        <Text style={{ color: "#fff" }}>
          { strings.generic.back }
        </Text>
      </Button>
    </View>
  );
};

export default BackButton;