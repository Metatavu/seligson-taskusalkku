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
  name: config.name || "Seligson & Co",
  slug: config.slug || "seligson-co",
  extra: {
    ...config.extra,
    ...process.env
  },
  version: "25.0.1",
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps"
      }
    ]
  }
});