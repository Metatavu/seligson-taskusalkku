import React, { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import ApiProvider from "./src/components/providers/api-provider";
import PortfoliosApiProvider from "./src/components/providers/portfolios-api-provider";
import FundsApiProvider from "./src/components/providers/funds-api-provider";
import MeetingsApiProvider from "./src/components/providers/meetings-api-provider";
import SecuritiesApiProvider from "./src/components/providers/securities-api-provider";
import PublicationsApiProvider from "./src/components/providers/publications-api-provider";
import CompaniesApiProvider from "./src/components/providers/companies-api-provider";
import { store } from "./src/app/store";
import AuthRefresh from "./src/components/containers/auth-refresh";
import ErrorHandler from "./src/components/error-handler/error-handler";
import theme from "./src/theme";
import Root from "./src/root";
import { StatusBar } from "expo-status-bar";
import PortfolioProvider from "./src/components/providers/portfolio-provider";
import CompanyProvider from "./src/components/providers/company-provider";
import { useInterval } from "./src/app/hooks";
import * as Updates from "expo-updates";

/**
 * API context provides
 */
const providers = [
  FundsApiProvider,
  PortfoliosApiProvider,
  MeetingsApiProvider,
  SecuritiesApiProvider,
  PublicationsApiProvider,
  CompaniesApiProvider
];

/**
 * App component
 */
const App: React.FC = () => {
  /**
   * Checks for app update from release channel
   */
  const checkAppUpdates = async () => {
    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
        const { isNew } = await Updates.fetchUpdateAsync();
        isNew && await Updates.reloadAsync();
      }
    } catch (error) {
      console.log("Error while updating software", error);
    }
  };

  /**
   * Interval for checking updates from release channel
   */
  useInterval(() => {
    checkAppUpdates();
  }, 5 * 60 * 1000);

  /**
   * Effect for checking updates from release channel when component mounts
   */
  useEffect(() => {
    checkAppUpdates();
  }, []);

  return (
    <StoreProvider store={ store }>
      <PaperProvider theme={ theme }>
        <ErrorHandler>
          <ApiProvider providers={ providers }>
            <PortfolioProvider>
              <CompanyProvider>
                <AuthRefresh/>
                {/* eslint-disable-next-line react/style-prop-object */}
                <StatusBar style="auto"/>
                <Root/>
              </CompanyProvider>
            </PortfolioProvider>
          </ApiProvider>
        </ErrorHandler>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;