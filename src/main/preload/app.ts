import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('app', {
  app: {
    showLeftbarContextMenu: (params: { x: number; y: number }) => {
      ipcRenderer.send('show-leftbar-context-menu', params);
    },
    showBoardContextMenu: (params: { x: number; y: number }) => {
      ipcRenderer.send('show-board-context-menu', params);
    },
    getAllExtensions: () => {
      return ipcRenderer.invoke('get-all-extensions');
    },
    deleteExtension: (id: string) => {
      ipcRenderer.send('delete-extension', id);
    },
    installExtension: (id: string) => {
      ipcRenderer.send('install-extension', id);
    },
    hideDownloadsPreview: () => {
      ipcRenderer.send('hide-downloads-preview');
    },
    getBookmarksProviders: () => {
      return ipcRenderer.invoke('get-bookmarks-providers');
    },
    getBookmarksFromProvider: (provider: string) => {
      return ipcRenderer.invoke('get-bookmarks-from-provider', provider);
    },
    importBookmarks: (bookmarks: any[]) => {
      ipcRenderer.send('import-bookmarks', bookmarks);
    },
    getBookmarksTags: () => {
      return ipcRenderer.invoke('get-bookmarks-tags');
    },
    editBookmark: (bookmark: any) => {
      ipcRenderer.send('edit-bookmark', bookmark);
    },
  },
  analytics: {
    event: (eventName: string, params: Record<string, string>) => {
      ipcRenderer.send('analytics', { eventName, params });
    },
  },
  db: {
    addHistory: (args: { url: string; title: string }) => {
      ipcRenderer.send('add-history', args);
    },
    findInHistory: (str: string) => {
      return ipcRenderer.invoke('find-in-history', str);
    },
    removeHistory: (id: number) => {
      ipcRenderer.send('remove-history', id);
    },
    clearHistory: () => {
      ipcRenderer.send('clear-history');
    },
    getAllHistory: () => {
      return ipcRenderer.invoke('get-all-history');
    },
    isBookmarked: (url: string) => {
      return ipcRenderer.invoke('is-bookmarked', url);
    },
    addBookmark: (args: { url: string; parent: number }) => {
      ipcRenderer.send('add-bookmark', args);
    },
    removeBookmark: (url: string) => {
      ipcRenderer.send('remove-bookmark', url);
    },
    getAllBookmarks: () => {
      return ipcRenderer.invoke('get-all-bookmarks');
    },
    addDownload: (args: { savePath: string; filename: string }) => {
      ipcRenderer.send('add-download', args);
    },
    getAllDownloads: () => {
      return ipcRenderer.invoke('get-all-downloads');
    },
    clearDownloads: () => {
      ipcRenderer.send('clear-downloads');
    },
    removeDownload: (id: number) => {
      ipcRenderer.send('remove-download', id);
    },
    findInBookmarks: (str: string) => {
      return ipcRenderer.invoke('find-in-bookmarks', str);
    },
  },
  config: {
    get: (key: string) => ipcRenderer.invoke('get-store-value', key),
    set: (args: { key: string; value: unknown }) =>
      ipcRenderer.send('set-store-value', args),
  },
  tools: {
    inspectElement: (point: { x: number; y: number }) => {
      ipcRenderer.send('inspectElement', point);
    },
    toggleDarkMode: () => {
      ipcRenderer.invoke('dark-mode:toggle');
    },
    changeLanguage: (locale: string) => {
      ipcRenderer.send('change-language', locale);
    },
    showItemInFolder: (filepath: string) => {
      ipcRenderer.send('show-item-in-folder', filepath);
    },
  },
  board: {
    open: (board: { id: string; label: string; isFullSize: boolean }) => {
      ipcRenderer.send('open-board', board);
    },
    close: () => {
      ipcRenderer.send('close-active-board');
    },
    selectNext: () => {
      ipcRenderer.send('select-next-board');
    },
    setWindowsCount: (args: { boardId: string; count: number }) => {
      ipcRenderer.send('set-windows-count', args);
    },
  },
  browser: {
    select: (webContentsId: number) => {
      ipcRenderer.send('select-browser', webContentsId);
    },
    selectBrowserView: () => {
      ipcRenderer.send('select-browserView');
    },
    certificateErrorAnswser: (args: {
      webContentsId: number;
      isTrusted: boolean;
    }) => {
      ipcRenderer.send('certificate-error-answser', args);
    },
  },
  listener: {
    newWindow: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('new-window', action);
    },
    loadBoard: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('load-board', action);
    },
    purge: (action: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
      ipcRenderer.on('purge', action);
    },
    renameBoard: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('rename-board', action);
    },
    closeWebview: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('close-webview', action);
    },
    closeAllWebview: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('close-all-webview', action);
    },
    closeOthersWebview: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('close-others-webview', action);
    },
    showAppMenu: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('show-app-menu', action);
    },
    certificateError: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('certificate-error', action);
    },
    downloading: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('downloading', action);
    },
    showDownloadsPreview: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('show-downloads-preview', action);
    },
    distributeWindowsEvenly: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('distribute-windows-evenly', action);
    },
    setDefaultWindowSize: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('set-default-window-size', action);
    },
  },
  off: {
    newWindow: () => {
      ipcRenderer.removeAllListeners('new-window');
    },
    loadBoard: () => {
      ipcRenderer.removeAllListeners('load-board');
    },
    purge: () => {
      ipcRenderer.removeAllListeners('purge');
    },
    renameBoard: () => {
      ipcRenderer.removeAllListeners('rename-board');
    },
    closeWebview: () => {
      ipcRenderer.removeAllListeners('close-webview');
    },
    closeAllWebview: () => {
      ipcRenderer.removeAllListeners('close-all-webview');
    },
    closeOthersWebview: () => {
      ipcRenderer.removeAllListeners('close-others-webview');
    },
    showAppMenu: () => {
      ipcRenderer.removeAllListeners('show-app-menu');
    },
    certificateError: () => {
      ipcRenderer.removeAllListeners('certificate-error');
    },
    downloading: () => {
      ipcRenderer.removeAllListeners('downloading');
    },
    showDownloadsPreview: () => {
      ipcRenderer.removeAllListeners('show-downloads-preview');
    },
    distributeWindowsEvenly: () => {
      ipcRenderer.removeAllListeners('distribute-windows-evenly');
    },
    setDefaultWindowSize: () => {
      ipcRenderer.removeAllListeners('set-default-window-size');
    },
  },
});
