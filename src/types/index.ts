import { FindFundRequest, FindPortfolioTransactionRequest, Fund, GetPortfolioSummaryRequest, ListFundsRequest, ListPortfolioSecuritiesRequest, ListPortfolioHistoryValuesRequest, ListPortfolioTransactionsRequest, Portfolio, PortfolioSecurity, PortfolioHistoryValue, PortfolioSummary, PortfolioTransaction, ListSecuritiesRequest, Security, FindSecurityRequest, CreateMeetingRequest, ListMeetingTimesRequest, Meeting, MeetingTime, ListSecurityHistoryValuesRequest, SecurityHistoryValue } from "../generated/client";

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
  portfolios?: Portfolio[];
  selectedPortfolio?: Portfolio;
  getEffectivePortfolios: () => Portfolio[] | undefined;
  onChange: (portfolio?: Portfolio) => void;
}

/**
 * Interface for funds API context type
 */
export interface FundsApiContextType {
  listFunds: (params: ListFundsRequest) => Promise<Fund[]>;
  findFund: (params: FindFundRequest) => Promise<Fund>;
}

/**
 * Interface for securities API context type
 */
export interface SecuritiesApiContextType {
  listSecurities: (params: ListSecuritiesRequest) => Promise<Security[]>;
  findSecurity: (params: FindSecurityRequest) => Promise<Security>;
  listSecurityHistoryValues: (params: ListSecurityHistoryValuesRequest) => Promise<SecurityHistoryValue[]>;
}

/**
 * Interface for portfolios API context
 */
export interface PortfoliosApiContextType {
  listPortfolios: () => Promise<Portfolio[]>;
  getPortfolioSummary: (params: GetPortfolioSummaryRequest) => Promise<PortfolioSummary>;
  listPortfolioHistoryValues: (params: ListPortfolioHistoryValuesRequest) => Promise<PortfolioHistoryValue[]>;
  listPortfolioSecurities: (params: ListPortfolioSecuritiesRequest) => Promise<PortfolioSecurity[]>;
  listPortfolioTransactions: (params: ListPortfolioTransactionsRequest) => Promise<PortfolioTransaction[]>;
  findPortfolioTransaction: (params: FindPortfolioTransactionRequest) => Promise<PortfolioTransaction>;
}

/**
 * Interface for publications API context
 */
export interface PublicationsApiContextType {
  listPublications: () => Promise<Publication[]>;
  findPublicationDetails: (id: number) => Promise<PublicationDetails | undefined>;
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
 * Interface for chart data
 */
export interface ChartData {
  x: Date;
  y: number;
}

/**
 * Base publication
 */
interface BasePublication {
  id: number;
  type: PublicationType;
  title: string;
  date: string;
  author: string[];
}

/**
 * Publication type
 */
export enum PublicationType {
  POST = "post",
  PHOEBUS = "se_phoebus",
  QUESTION = "se_kysymys_vastaus"
}

/**
 * Publication
 */
export interface Publication extends BasePublication {
  category: string;
}

/**
 * Publication details
 */
export interface PublicationDetails extends BasePublication {
  content: string;
}

/**
 * Portfolio security category
 */
export interface PortfolioSecurityCategory {
  fundId: string;
  name: string;
  totalValue: string;
  currency: string;
  color: string;
  percentage: string;
  groupColor: string;
}

/**
 * Reference type of portfolio
 */
export enum PORTFOLIO_REFERENCE_TYPE {
  A = "A",
  B = "B"
}

/**
 * Drop down option
 */
export interface SubscriptionOption {
  key: string;
  label: string;
  description?: string;
  value: string;
}

/**
 * Subscription settings
 */
export interface SubscriptionSettings {
  bankName?: string;
  iBAN?: string;
  referenceNumber?: string;
  portfolio?: Portfolio;
  shareType: PORTFOLIO_REFERENCE_TYPE;
  dueDate: Date;
  sum: string;
  fund: Fund;
}

/**
 * Date picker mode type
 */
export type IOSMode = "date" | "time" | "datetime" | "countdown";

/*
 * Date picker event data
 */
export interface DatePickerEvent {
  nativeEvent: {
    timestamp: string;
  };
  type: string;
}

export type Currency = "EUR" | "SEK";

/**
 * My security info
 */
export interface MySecurityInfo {
  portfolioId: string;
  portfolioSecurity: PortfolioSecurity;
  security: Security;
  fund: Fund;
}