import { ChartData } from "../types";

/**
 * Hideous injectable html and script strings
 *
 * Ugly hacks - use at your own risk!
 */
namespace Injectables {

  /**
   * Returns html for chart
   *
   * @param backgroundColor html background color
   */
  export const getChartHtml = (backgroundColor: string) => `
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/luxon/2.3.0/luxon.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-adapter-luxon/1.1.0/chartjs-adapter-luxon.min.js"></script>
      </head>
      <body style="background-color: ${backgroundColor}">
        <canvas id="history-value-chart"/>
      </body>
    </html>
  `;

  /**
   * Returns injectable Javascript code for webview chart
   *
   * @param data chart data
   * @param language language
   * @param valueCurrency currency
   * @param chartColor chart color
   */
  export const getChartScript = (
    data: ChartData[],
    language: string,
    valueCurrency: string,
    chartColor: string
  ) => `
    try {
      luxon.Settings.defaultLocale = "${language}";

      const existingChart = Chart.getChart("history-value-chart");
      if (existingChart) {
        existingChart.destroy();
      }

      const canvas = document.getElementById("history-value-chart");

      Chart.defaults.font.size = 12;
      Chart.defaults.color = "white";
      Chart.defaults.backgroundColor = "${chartColor}20";

      const data = ${JSON.stringify(data)}.map(item => ({ ...item, x: new Date(item.x).valueOf() }));

      const chart = new Chart(canvas, {
        type: "line",
        data: {
          datasets: [{
            data: data,
            borderColor: "${chartColor}",
            borderWidth: 1,
            fill: "origin",
            pointHoverBackgroundColor: "${chartColor}"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            point: {
              radius: 0,
              hitRadius: 200
            }
          },
          interaction: {
            mode: "nearest",
            intersect: false
          },
          hover: {
            mode: "nearest",
            intersect: true
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: "nearest",
              intersect: false,
              displayColors: false,
              cornerRadius: 8,
              caretSize: 6,
              padding: 8,
              callbacks: {
                title: items => luxon.DateTime.fromMillis(items[0].raw.x).toLocaleString(),
                label: function(context) {
                  if (context.parsed.y !== null) {
                      return new Intl.NumberFormat("fi-FI", { style: "currency", currency: "${valueCurrency}" }).format(context.parsed.y);
                  }
                  return "";
                }
              }
            }
          },
          scales: {
            x: {
              type: "time",
              time: {
                displayFormats: {
                  day: "D",
                  month: "LLL y"
                }
              },
              ticks: {
                maxRotation: 0,
                autoSkipPadding: 16
              }
            },
            y: {
              grace: "50%",
              ticks: {
                precision: 3,
                callback: function(value, index, values) {
                  return new Intl.NumberFormat("fi-FI", { style: "currency", currency: "${valueCurrency}" }).format(value)
                }
              },
              afterBuildTicks: axis => {
                axis.ticks = axis.ticks.filter(tick => tick.value >= 0);
                if (axis.min < 0) axis.min = 0;
              }
            }
          }
        }
      });
    } catch (e) {
      window.ReactNativeWebView.postMessage(e.stack);
    }

    true;
  `;

  /**
   * Returns injectable Javascript code for handling errors of injected code inside webview
   */
  export const getErrorHandlerScript = () => `
    window.onerror = function(message, sourcefile, lineno, colno, error) {
      window.ReactNativeWebView.postMessage(\`Message: \${message}\\nSource: \${sourcefile} \\nLine: \${lineno} : \${colno}\`);
      return true;
    };

    true;
  `;

  /**
   * Returns injectable Javascript code for publication details
   */
  export const getPublicationsScript = () => `
    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
    true;
  `;

  /**
   * Returns html for publication details
   *
   * @param content content html string
   */
  export const getPublicationDetailsHtml = (content: string) => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1">
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;

}

export default Injectables;