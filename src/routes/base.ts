import { ScreenProps } from "../types/navigation";
import { NavigationUtils } from "../utils/navigation-utils";
import HomeScreen from "../components/screens/base/home-screen";

/**
 * Returns root navigation base routes
 */
const getBaseRoutes = (): ScreenProps[] => [
  {
    name: "Home",
    component: HomeScreen,
    options: NavigationUtils.getPrimaryHeaderOptions()
  }
];

export default getBaseRoutes;