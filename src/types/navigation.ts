import { Route, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationOptions, NativeStackNavigationProp } from "@react-navigation/native-stack";

/**
 * Root stack navigation props
 */
export type RootStackNavigationProps<RouteName extends keyof RootNavigationRoutes> =
  NativeStackNavigationProp<RootNavigationRoutes, RouteName>;

/**
 * Root stack route props
 */
export type RootStackRouteProps<RouteName extends keyof RootNavigationRoutes> =
  RouteProp<RootNavigationRoutes, RouteName>;

/**
 * Root navigation parameters for all pages in navigation stack
 */
export type RootNavigationRoutes = RootNavigationBaseRoutes;

/**
 * Root navigation base routes
 */
type RootNavigationBaseRoutes = {
  Home: undefined;
};

/**
 * Screen properties
 */
export interface ScreenProps {
  name: keyof RootNavigationRoutes;
  component: React.ComponentType<any>;
  options: NativeStackNavigationOptions | ((props: NavigationHeaderProps) => NativeStackNavigationOptions);
}

/**
 * Generic navigation header properties
 */
export interface NavigationHeaderProps {
  route: Route<any, any>;
  navigation: NativeStackNavigationProp<RootNavigationRoutes, any>;
}