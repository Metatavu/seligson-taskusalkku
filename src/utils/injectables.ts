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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/luxon/2.3.0/luxon.min.js"></script>
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
                title: items => luxon.DateTime.fromMillis(items[0].raw.x).toLocaleString()
              }
            }
          },
          scales: {
            x: {
              type: "time",
              time: {
                displayFormats: {
                  day: "D"
                }
              },
              ticks: {
                maxRotation: 0
              }
            },
            y: {
              grace: "50%",
              ticks: {
                format: {
                  style: "currency",
                  currency: "${valueCurrency}",
                  minimumSignificantDigits: 3
                }
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

}

export default Injectables;