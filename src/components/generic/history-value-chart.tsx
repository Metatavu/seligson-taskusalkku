import React from "react";
import { GestureResponderEvent, View } from "react-native";
import { useTheme } from "react-native-paper";
import WebView from "react-native-webview";
import { PortfolioHistoryValue, SecurityHistoryValue } from "../../generated/client";
import ChartUtils from "../../utils/chart";
import Injectables from "../../utils/injectables";
import styles from "../../styles/generic/history-value-chart";

/**
 * Component properties
 */
interface Props {
  historyValues: SecurityHistoryValue[] | PortfolioHistoryValue[];
  currency?: string;
  color?: string;
  onChartTouch?: (event: GestureResponderEvent) => void;
}

/**
 * History value chart component
 *
 * @param props component properties
 */
const HistoryValueChart: React.FC<Props> = ({
  historyValues,
  color = "#000000",
  currency = "EUR",
  onChartTouch
}) => {
  const theme = useTheme();

  const webViewRef = React.useRef<WebView>(null);
  const [ webViewReady, setWebViewReady ] = React.useState(false);
  const [ viewReady, setViewReady ] = React.useState(false);

  /**
   * Effect that updated webview script when webview is ready or data is changed
   */
  React.useEffect(() => {
    setTimeout(() => {
      webViewRef.current?.injectJavaScript(
        Injectables.getChartScript(
          ChartUtils.convertToChartData(historyValues),
          currency,
          color
        )
      );

      setViewReady(true);
    }, 100);
  }, [ historyValues, webViewReady ]);

  /**
   * Component render
   */
  return (
    <View style={{ opacity: Number(viewReady) }}>
      <WebView
        ref={ webViewRef }
        originWhitelist={[ "*" ]}
        scrollEnabled={ false }
        overScrollMode="never"
        bounces={ false }
        source={{ html: Injectables.getChartHtml(theme.colors.surface) }}
        containerStyle={{ backgroundColor: theme.colors.surface }}
        injectedJavaScriptBeforeContentLoaded={ Injectables.getErrorHandlerScript() }
        onTouchStart={ onChartTouch }
        // eslint-disable-next-line no-console
        onMessage={ event => console.error(event.nativeEvent.data) }
        onLoad={ () => setWebViewReady(true) }
        style={ styles.webView }
      />
    </View>
  );
};

export default HistoryValueChart;