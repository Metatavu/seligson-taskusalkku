import { ExpoConfig, ConfigContext } from "@expo/config";
import "dotenv/config";

/**
 * Custom mapper for Expo config plugin
 * Maps environment variables to Expo's manifest,
 * so they can be accessed inside Expo app.
 *
 * !!! DO NOT PUT ANY SECRETS TO ENVIRONMENT VARIABLES !!!
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "example",
  slug: "example",
  extra: {
    ...config.extra,
    ...process.env
  },
  version: "1.0.0",
  privacy: "unlisted",
  scheme: "fi.metatavu.example"
});