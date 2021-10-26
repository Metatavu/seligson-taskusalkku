import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigationRoutes, ScreenProps } from "./src/types/navigation";
import moment from "moment";
import "moment/locale/fi";
import strings from "./src/localization/strings";
import { getBaseRoutes } from "./src/routes/base";

/**
 * Initialized root stack navigator
 */
const RootStack = createNativeStackNavigator<RootNavigationRoutes>();

/**
 * Application component
 */
const App: React.FC = () => {
  /**
   * Effects that need to be executed when application starts
   */
  React.useEffect(() => {
    moment.locale(strings.getLanguage());
  }, []);

  /**
   * Renders screen
   *
   * @param screenProps screen props
   * @param index list index
   */
  const renderScreen = (screenProps: ScreenProps, index: number) => (
    <RootStack.Screen key={ index } { ...screenProps }/>
  );

  /**
   * Renders all application screens
   * Include all application screens here to register them to the navigator
   */
  const renderScreens = () => [
    ...getBaseRoutes().map(renderScreen)
  ];

  /**
   * Component render
   */
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        { renderScreens() }
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;