import React from "react";
import { Title, IconButton } from "react-native-paper";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { NavigationHeaderProps, RootNavigationRoutes } from "../types/navigation";
import { theme } from "../theme";
import styles from "../styles/utils/navigation-utils";

/**
 * Class for navigation utility methods
 */
class NavigationUtils {

  /**
   * Navigates to given route of root navigation routes
   *
   * @param navigation navigation instance
   * @param currentRoute current route
   * @param routeName route name to navigate to
   * @param reset whether to reset navigation state or not
   */
  public static navigateTo = (
    navigation: NavigationProp<any>,
    currentRoute: RouteProp<any, any>,
    routeName: keyof RootNavigationRoutes,
    reset?: boolean
  ) => () => {
    if (routeName === currentRoute.name) {
      return;
    }

    if (reset) {
      navigation.reset({
        index: 0,
        routes: [{ name: routeName }]
      });
    } else {
      navigation.navigate(routeName);
    }
  };

  /**
   * Returns navigation options for primary header
   *
   * @returns function that returns stack navigation options for stack navigator screen
   */
  public static getPrimaryHeaderOptions = () => (): NativeStackNavigationOptions => ({
    animationTypeForReplace: "push",
    gestureEnabled: false,
    headerStyle: styles.headerStyle
  });

  /**
   * Returns secondary header options
   *
   * @param title page title
   * @returns function that returns stack navigation options for stack navigator screen
   */
  public static getSecondaryHeaderOptions = (title: string) => (props: NavigationHeaderProps): NativeStackNavigationOptions => ({
    gestureEnabled: false,
    headerStyle: {
      backgroundColor: theme.colors?.primary
    },
    headerTitle: () => <Title>{ title }</Title>,
    headerLeft: () => <IconButton icon="arrow-left" onPress={ props.navigation.goBack }/>
  });

  /**
   * Returns tertiary header options
   *
   * @returns function that returns stack navigation options for stack navigator screen
   */
  public static getTertiaryHeaderOptions = () => (props: NavigationHeaderProps): NativeStackNavigationOptions => ({
    gestureEnabled: false,
    headerStyle: {
      backgroundColor: theme.colors.background
    },
    headerLeft: () => <IconButton icon="arrow-left" onPress={ props.navigation.goBack }/>
  });

  /**
   * Returns no header options
   *
   * @returns function that returns stack navigation options for stack navigator screen
   */
  public static getNoHeaderOptions = () => (): NativeStackNavigationOptions => ({
    gestureEnabled: false,
    headerShown: false
  });

}

export default NavigationUtils;