import { CreateMeetingRequest, FindFundRequest, FindPortfolioTransactionsRequest, Fund, GetPortfolioHSummaryRequest, HistoricalValue, ListFundsRequest, ListHistoricalValuesRequest, ListPortfolioFundsRequest, ListPortfolioHistoryValuesRequest, Meeting, MeetingTime, ListPortfolioTransactionsRequest, Portfolio, PortfolioFund, PortfolioHistoryValue, PortfolioSummary, PortfolioTransaction, ListMeetingTimesRequest } from "../generated/client";

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
  selectedPortfolio?: Portfolio;
  onChange: (portfolio?: Portfolio) => void;
}

/**
 * Interface for portfolios API context
 */
export interface PortfoliosApiContextType {
  listPortfolios: () => Promise<Portfolio[]>;
  listPortfolioHistoryValues: (params: ListPortfolioHistoryValuesRequest, range?: ChartRange) => Promise<PortfolioHistoryValue[]>;
  getPortfolioHSummary: (params: GetPortfolioHSummaryRequest) => Promise<PortfolioSummary>;
}

/**
 * Interface for funds API context type
 */
export interface FundsApiContextType {
  listFunds: (params: ListFundsRequest) => Promise<Fund[]>;
  findFund: (params: FindFundRequest) => Promise<Fund>;
  listHistoricalValues: (params: ListHistoricalValuesRequest) => Promise<HistoricalValue[]>
}

/**
 * Interface for portfolio transactions API context type
 */
export interface PortfolioTransactionsApiContextType {
  listPortfolioTransactions: (params: ListPortfolioTransactionsRequest) => Promise<PortfolioTransaction[]>;
  findPortfolioTransactions: (params: FindPortfolioTransactionsRequest) => Promise<PortfolioTransaction>;
}

/**
 * Interface for portfolio funds API context
 */
export interface PortfolioFundsApiContextType {
  listPortfolioFunds: (params: ListPortfolioFundsRequest) => Promise<PortfolioFund[]>;
}

/**
 * Interface for meetings API context
 */
export interface MeetingsApiContextType {
  createMeeting: (params: CreateMeetingRequest) => Promise<Meeting>;
  listMeetingTimes: (params: ListMeetingTimesRequest) => Promise<Array<MeetingTime>>;
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
 * Enum for meeting language select
 */
export enum MeetingLanguage {
  FI = "fi",
  EN = "en"
}

/**
 * Interface for victory chart data
 */
export interface VictoryChartData {
  x: Date;
  y: number;
}