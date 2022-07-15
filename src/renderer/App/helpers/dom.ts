/* eslint-disable import/prefer-default-export */
export const getWebviewFromBrowserId = (browserId: string) => {
  const container = document.querySelector(`#Browser__${browserId}`);
  const webview: Electron.WebviewTag | undefined | null =
    container?.querySelector('webview');

  return webview;
};
