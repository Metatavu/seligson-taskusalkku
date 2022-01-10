import { OAuthProps } from "expo-app-auth";

/**
 * Static application configuration
 */
export interface StaticConfig {
  developmentBuild: boolean;
  apiBasePath: string;
  authLogoutEndpoint: string;
  auth: OAuthProps;
  demoLoginUrl: string;
  anonymousPassword: string;
  blogApiUrl: string;
}

/**
 * Application local configuration keys
 */
export interface LocalConfig {
  "@language": boolean;
}

/**
 * Application languages
 */
export enum Language {
  FI = "fi",
  EN = "en"
}