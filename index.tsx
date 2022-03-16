import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import App from "./App";
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true,
  attachStacktrace: true
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => Root);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);