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