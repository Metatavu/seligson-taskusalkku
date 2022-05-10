import { OAuthProps } from "expo-app-auth";
import HomeNavigator from "./navigators/home";

/**
 * Extended authentication properties
 */
export interface AuthProps extends OAuthProps {
  anonymousScopes: string[];
}

/**
 * Static application configuration
 */
export interface StaticConfig {
  developmentBuild: boolean;
  apiBasePath: string;
  authLogoutEndpoint: string;
  auth: AuthProps;
  demoLoginUrl: string;
  anonymousPassword: string;
  blogApiUrl: string;
}

/**
 * Application local configuration keys
 */
export interface LocalConfig {
  "@language": Language;
  "@initialRoute": keyof HomeNavigator.Routes;
  "@preferredLogin": LoginOptions;
}

/**
 * Application languages
 */
export enum Language {
  FI = "fi",
  EN = "en",
  SV = "sv"
}

/**
 * Enum for possible login options
 */
export enum LoginOptions {
  USERNAME_AND_PASSWORD = "USERNAME_AND_PASSWORD",
  STRONG_AUTH = "STRONG_AUTH",
  PIN = "PIN",
  BIOMETRIC = "BIOMETRIC"
}

/**
 * Enum for possible default login route options
 */
export enum DefaultRoutes {
  PORTFOLIO = "portfolio",
  FUNDS = "funds"
}