import React from "react";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import AuthRefresh from "./src/components/containers/auth-refresh";
import ErrorHandler from "./src/components/error-handler/error-handler";
import { store } from "./src/app/store";
import theme from "./src/theme";
import App from "./App";
import ApiProvider from "./src/components/providers/api-provider";
import PortfoliosApiProvider from "./src/components/providers/portfolios-api-provider";
import FundsApiProvider from "./src/components/providers/funds-api-provider";
import SecuritiesApiProvider from "./src/components/providers/securities-api-provider";

/**
 * API context provides
 */
const providers = [
  FundsApiProvider,
  PortfoliosApiProvider,
  SecuritiesApiProvider
];

/**
 * Root component
 */
const Root: React.FC = () => (
  <StoreProvider store={ store }>
    <PaperProvider theme={ theme }>
      <ErrorHandler>
        <ApiProvider providers={ providers }>
          <AuthRefresh/>
          <App/>
        </ApiProvider>
      </ErrorHandler>
    </PaperProvider>
  </StoreProvider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => Root);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);