import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import ApiProvider from "./src/components/providers/api-provider";
import PortfoliosApiProvider from "./src/components/providers/portfolios-api-provider";
import FundsApiProvider from "./src/components/providers/funds-api-provider";
import MeetingsApiProvider from "./src/components/providers/meetings-api-provider";
import SecuritiesApiProvider from "./src/components/providers/securities-api-provider";
import PublicationsApiProvider from "./src/components/providers/publications-api-provider";
import { store } from "./src/app/store";
import AuthRefresh from "./src/components/containers/auth-refresh";
import ErrorHandler from "./src/components/error-handler/error-handler";
import theme from "./src/theme";
import Root from "./src/root";
import { StatusBar } from "expo-status-bar";
import PortfolioProvider from "./src/components/providers/portfolio-provider";

/**
 * API context provides
 */
const providers = [
  FundsApiProvider,
  PortfoliosApiProvider,
  MeetingsApiProvider,
  SecuritiesApiProvider,
  PublicationsApiProvider
];

/**
 * App component
 */
const App: React.FC = () => (
  <StoreProvider store={ store }>
    <PaperProvider theme={ theme }>
      <ErrorHandler>
        <ApiProvider providers={ providers }>
          <PortfolioProvider>
            <AuthRefresh/>
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style="auto"/>
            <Root/>
          </PortfolioProvider>
        </ApiProvider>
      </ErrorHandler>
    </PaperProvider>
  </StoreProvider>
);

export default App;