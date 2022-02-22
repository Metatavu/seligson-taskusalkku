import { Theme } from "react-native-paper/lib/typescript/types";
import { ChartData, PublicationDetails } from "../types";
import DateUtils from "./date-utils";
import GenericUtils from "./generic";

/**
 * Injectable html and script strings
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
      <body style="background-color: ${backgroundColor}; padding: 0; margin: 0">
        <canvas id="history-value-chart" />
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
      luxon.Settings.defaultLocale = "fi-FI";

      const existingChart = Chart.getChart("history-value-chart");
      if (existingChart) {
        existingChart.destroy();
      }

      const canvas = document.getElementById("history-value-chart");

      Chart.defaults.font.size = 12;
      Chart.defaults.color = "black";
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
                  month: "M/y"
                }
              },
              ticks: {
                maxRotation: 0,
                autoSkipPadding: 16
              }
            },
            y: {
              grace: "0%",
              beginAtZero: true,
              ticks: {
                precision: 3,
                callback: function(value, index, values) {
                  return new Intl.NumberFormat("fi-FI", { style: "currency", currency: "${valueCurrency}" }).format(value).replace(",00", "")
                }
              },
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
   * @param publicationDetails publication details
   */
  export const getPublicationDetailsHtml = (
    { title, author, date, content }: PublicationDetails,
    subject: string,
    theme: Theme
  ) => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
      </head>
      <body>
        <h1>
          ${unescape(title)}
        </h1>
        <hr/>
        <div class="sub-header">
          <div class="logo"></div>
          <div>
            <p class="meta-data">${GenericUtils.getPublicationAuthor(author)} | ${DateUtils.formatToFinnishDate(date)}</p>
            <p class="subject">${subject}</p>
          </div>
        </div>
        ${content}
        <style>
          * {
            font-family: 'Montserrat', sans-serif;
            line-height: 1.5;
          }

          body {
            padding: 12px;
          }

          h1 {
            font-size: 20px;
            color: ${theme.colors.primary};
          }

          h2, p, td {
            font-size: 14px;
          }

          hr {
            height: 2px;
            border-width: 0;
            color: #CCC;
            background-color: #EAEAEA;
          }

          a {
            text-decoration: none;
            color: ${theme.colors.primary};
          }

          td {
            padding: 4px;
          }

          blockquote {
            border-left: 6px solid ${theme.colors.primary};
            margin: 1.5em 0;
            padding: 0.5em 0 0.5em 1em;
          }

          blockquote p {
            display: inline;
          }

          .sub-header {
            display: flex;
            align-items: center;
          }

          .meta-data {
            margin: 0;
            font-size: 12px;
            font-weight: bold;
          }

          .subject {
            margin: 0;
            margin-top: 8px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.colors.primary};
          }

          .logo {
            width: 80px;
            height: 80px;
            background: url(https://cdn.metatavu.io/assets/seligson/blog_logo.png) no-repeat;
            background-size: contain;
            background-position: center;
          }

          img.alignright {
            float: right;
          }
        </style>
      </body>
    </html>
  `;

}

export default Injectables;