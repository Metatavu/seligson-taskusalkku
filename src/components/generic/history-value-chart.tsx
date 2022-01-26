import React from "react";
import { useTheme } from "react-native-paper";
import WebView from "react-native-webview";
import { useAppSelector } from "../../app/hooks";
import { selectSelectedLanguage } from "../../features/locale/locale-slice";
import { SecurityHistoryValue } from "../../generated/client";
import ChartUtils from "../../utils/chart";
import Injectables from "../../utils/injectables";

/**
 * Component properties
 */
interface Props {
  historyValues: SecurityHistoryValue[];
  currency?: string;
  color?: string;
}

/**
 * History value chart component
 *
 * @param props component properties
 */
const HistoryValueChart: React.FC<Props> = ({
  historyValues,
  color = "#ffffff",
  currency = "EUR"
}) => {
  const theme = useTheme();
  const selectedLanguage = useAppSelector(selectSelectedLanguage);

  const webViewRef = React.useRef<WebView>(null);
  const [ webViewReady, setWebViewReady ] = React.useState(false);

  /**
   * Effect that updated webview script when webview is ready or data is changed
   */
  React.useEffect(() => {
    webViewReady && webViewRef.current?.injectJavaScript(
      Injectables.getChartScript(
        ChartUtils.convertToChartData(historyValues),
        selectedLanguage,
        currency,
        color
      )
    );
  }, [ historyValues, webViewReady ]);

  /**
   * Component render
   */
  return (
    <WebView
      ref={ webViewRef }
      originWhitelist={[ "*" ]}
      source={{ html: Injectables.getChartHtml(theme.colors.backgroundDark) }}
      injectedJavaScriptBeforeContentLoaded={ Injectables.getErrorHandlerScript() }
      onLoad={ () => setWebViewReady(true) }
      // eslint-disable-next-line no-console
      onMessage={ event => console.error(event.nativeEvent.data) }
      style={{
        height: 300,
        backgroundColor: theme.colors.backgroundDark
      }}
    />
  );
};

export default HistoryValueChart;