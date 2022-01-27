/**
 * Hideous injectable html and script strings
 *
 * Ugly hacks - use at your own risk!
 */
namespace Injectables {

  /**
   * Temporary iOS zoom fix.
   *
   * TODO: Add html elements which would solve this during render
   */
  export const iosWebviewZoomFix = `
    const meta = document.createElement("meta");
    meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1");
    meta.setAttribute("name", "viewport");
    document.getElementsByTagName("head")[0].appendChild(meta);
    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
    true;
  `;

}

export default Injectables;