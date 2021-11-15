import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Config from "../../app/config";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/auth-slice";
import strings from "../../localization/strings";
import AuthNavigator from "../../types/navigators/auth";
import AuthUtils from "../../utils/auth";

/**
 * Account screen
 */
const AccountScreen: React.FC = () => {
  const { developmentBuild } = Config.getStatic();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AuthNavigator.NavigationProps>();

  /**
   * Removes local values
   */
  const removeLocalValues = async () => {
    dispatch(logout());
    await Promise.all([
      AuthUtils.removeOfflineToken()
    ]);

    navigation.navigate("welcome");
  };

  /**
   * Renders remove local values button if development environmental variables is set to true.
   * Used only for debugging purposes
   */
  const renderRemoveLocalValues = () => {
    if (developmentBuild) {
      return (
        <View>
          <Button onPress={ removeLocalValues }>
            RESET LOCAL VALUES
          </Button>
        </View>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text>{ strings.generic.notImplemented }</Text>
      <View style={{ marginTop: 200 }}>
        { renderRemoveLocalValues() }
      </View>
    </View>
  );
};

export default AccountScreen;