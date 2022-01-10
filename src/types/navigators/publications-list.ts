import { RouteProp } from "@react-navigation/native";
import { MaterialTopTabBarProps, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

/**
 * Publications list navigator
 */
namespace PublicationsListNavigator {

  /**
   * Routes
   */
  export type Routes = {
    reviews: undefined;
    topical: undefined;
    questions: undefined;
    phoebus: undefined;
  };

  /**
   * Navigation properties
   */
  export type NavigationProps = MaterialTopTabBarProps;

  /**
   * Route properties
   */
  export type RouteProps<RouteName extends keyof Routes = keyof Routes> = RouteProp<Routes, RouteName>;

  /**
   * Screen properties
   */
  export type ScreenProps<RouteName extends keyof Routes = keyof Routes> = MaterialTopTabScreenProps<Routes, RouteName>;

}

export default PublicationsListNavigator;