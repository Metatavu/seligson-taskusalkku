import { ExpoConfig, ConfigContext } from "@expo/config";
import "dotenv/config";

/**
 * Custom mapper for Expo config plugin
 * Maps environment variables to Expo's manifest,
 * so they can be accessed inside Expo app.
 *
 * !!! DO NOT PUT ANY SECRETS TO ENVIRONMENT VARIABLES !!!
 */

const version = "25.1.7";

/**
 * Generates Android version code from version string
 * 
 * @returns Android version code
 */
const getAndroidVersionCode = () => {
  const parts = version.split(".");
  const major = parseInt(parts[0], 10) * 100000;
  const middle = parseInt(parts[1], 10) * 1000;
  const minor = parseInt(parts[2], 10) * 10;
  return major + middle + minor;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  version: version,
  name: process.env.REACT_APP_EXPO_APP_NAME || "Seligson & Co",
  slug: process.env.REACT_APP_EXPO_APP_SLUG || "seligson-co",
  ios: {
    ...config.ios,
    bundleIdentifier: process.env.REACT_APP_EXPO_IOS_BUNDLE_IDENTIFIER || "fi.seligson",
    buildNumber: version
  },
  android: {
    ...config.android,
    package: process.env.REACT_APP_EXPO_ANDROID_PACKAGE || "fi.seligson",
    versionCode: getAndroidVersionCode()
  },
  extra: {
    ...config.extra,
    ...process.env
  },
  scheme: process.env.REACT_APP_EXPO_SCHEME || "fi.seligson",
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps"
      }
    ]
  }
});
