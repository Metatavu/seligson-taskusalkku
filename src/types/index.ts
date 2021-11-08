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
 * Fund data
 */
export interface FundData {
  id: number;
  fundName: string;
  fundType: FundType;
  lahiTapiola: boolean;
  aShare: number;
  bShare: number;
  priceHistory: PriceHistory;
  lastUpdated: string;
  riskLevel: number;
  color: string;
}

/**
 * Price history
 */
export interface PriceHistory {
  oneDay: number;
  oneMonth: number;
  oneYear: number;
  fiveYears: number;
  twentyYears: number;
}

/**
 * Fund types
 */
export enum FundType {
  PASSIVE = "passive",
  ACTIVE = "active",
  INTEREST = "interest",
  COMPINATION = "compination"
}