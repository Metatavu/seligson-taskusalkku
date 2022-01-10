import { FindFundRequest, FindPortfolioTransactionRequest, Fund, GetPortfolioSummaryRequest, FundHistoryValue, ListFundsRequest, ListFundHistoryValuesRequest, ListPortfolioSecuritiesRequest, ListPortfolioHistoryValuesRequest, ListPortfolioTransactionsRequest, Portfolio, PortfolioSecurity, PortfolioHistoryValue, PortfolioSummary, PortfolioTransaction, ListSecuritiesRequest, Security, FindSecurityRequest } from "../generated/client";

/**
 * Parsed access token
 */
export interface ParsedToken {
  email: string;
  name: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  sub: string;
}

/**
 * Authentication
 */
export interface Authentication {
  accessToken: string;
  refreshToken: string;
  userId: string;
  roles: UserRoles;
  expiresAt: Date;
}

/**
 * User roles
 */
export interface UserRoles {
  realm: string[];
  resource: string[];
}

/**
 * Error context type
 */
export interface ErrorContextType {
  error?: string;
  setError: (message: string, error?: any) => void;
}

/**
 * Interface for portfolio context
 */
export interface PortfolioContextType {
  portfolios: Portfolio[];
  selectedPortfolio?: Portfolio;
  getEffectivePortfolios: () => Portfolio[];
  onChange: (portfolio?: Portfolio) => void;
}

/**
 * Interface for funds API context type
 */
export interface FundsApiContextType {
  listFunds: (params: ListFundsRequest) => Promise<Fund[]>;
  findFund: (params: FindFundRequest) => Promise<Fund>;
  listFundHistoryValues: (params: ListFundHistoryValuesRequest) => Promise<FundHistoryValue[]>
}

/**
 * Interface for securities API context type
 */
export interface SecuritiesApiContextType {
  listSecurities: (params: ListSecuritiesRequest) => Promise<Security[]>;
  findSecurity: (params: FindSecurityRequest) => Promise<Security>;
}

/**
 * Interface for portfolios API context
 */
export interface PortfoliosApiContextType {
  listPortfolios: () => Promise<Portfolio[]>;
  getPortfolioSummary: (params: GetPortfolioSummaryRequest) => Promise<PortfolioSummary>;
  listPortfolioHistoryValues: (params: ListPortfolioHistoryValuesRequest, range?: ChartRange) => Promise<PortfolioHistoryValue[]>;
  listPortfolioSecurities: (params: ListPortfolioSecuritiesRequest) => Promise<PortfolioSecurity[]>;
  listPortfolioTransactions: (params: ListPortfolioTransactionsRequest) => Promise<PortfolioTransaction[]>;
  findPortfolioTransaction: (params: FindPortfolioTransactionRequest) => Promise<PortfolioTransaction>;
}

/**
 * Enum for chart range select
 */
export enum ChartRange {
  MONTH = "MONTH",
  YEAR = "YEAR",
  THREE_YEARS = "THREE_YEARS",
  FIVE_YEARS = "FIVE_YEARS",
  TEN_YEARS = "TEN_YEARS",
  MAX = "MAX"
}

/**
 * Interface for victory chart data
 */
export interface VictoryChartData {
  x: Date;
  y: number;
}