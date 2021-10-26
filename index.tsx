import * as React from "react";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import AuthRefresh from "./src/components/containers/auth-refresh";
import ErrorHandler from "./src/components/error-handler/error-handler";
import { store } from "./src/app/store";
import { theme } from "./src/theme";
import App from "./App";

/**
 * Root component
 */
const Root: React.FC = () => (
  <StoreProvider store={ store }>
    <PaperProvider theme={ theme }>
      <ErrorHandler>
        <AuthRefresh/>
        <App/>
      </ErrorHandler>
    </PaperProvider>
  </StoreProvider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => Root);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);