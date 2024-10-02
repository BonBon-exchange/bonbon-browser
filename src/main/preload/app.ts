import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { TFunction } from 'react-i18next';

import { EventParams } from 'types/analytics';
import { Board } from 'types/boards';
import { Bookmark, Provider, Tag } from 'types/bookmarks';
import { ConfigKeys } from 'types/configKeys';
import { Download } from 'types/downloads';
import { Extension } from 'types/extensions';
import { Locale } from 'types/i18n';
import {
  IpcAddBookmark,
  IpcAddDownload,
  IpcAddHistory,
  IpcCertificateError,
  IpcCertificateErrorAnswer,
  IpcCloseAllWebview,
  IpcCloseOthersWebview,
  IpcCloseWebview,
  IpcDistributeWindowsEvenly,
  IpcDownloading,
  IpcInspectElement,
  IpcLoadBoard,
  IpcLoadSavedBoardCallback,
  IpcNewWindow,
  IpcPinWebview,
  IpcPurge,
  IpcRenameBoard,
  IpcResetBoard,
  IpcSaveBoard,
  IpcSetDefaultWindowSize,
  IpcSetWindowsCount,
  IpcShowAppMenu,
  IpcShowBoardContextMenu,
  IpcShowDownloadsPreview,
  IpcShowLeftbarContextMenu,
} from 'types/ipc';
import { DomainSuggestion } from 'types/suggestions';

contextBridge.exposeInMainWorld('app', {
  board: {
    add: (params: { newSession?: boolean }) => {
      ipcRenderer.send('open-new-board', params);
    },
    close: () => {
      ipcRenderer.send('close-active-board');
    },
    selectNext: () => {
      ipcRenderer.send('select-next-board');
    },
    setWindowsCount: (args: IpcSetWindowsCount) => {
      ipcRenderer.send('set-windows-count', args);
    },
    getAllBoards: (): Promise<Board[]> => {
      return ipcRenderer.invoke('get-all-boards');
    },
    save: (board: Board) => {
      ipcRenderer.send('save-board-callback', board);
    },
    delete: (boardId: string) => {
      ipcRenderer.send('delete-board', boardId);
    },
    load: (board: Board) => {
      ipcRenderer.send('load-saved-board', board);
    },
  },
  bookmark: {
    findInBookmarks: (str: string): Promise<Bookmark[]> => {
      return ipcRenderer.invoke('find-in-bookmarks', str);
    },
    editBookmark: (bookmark: Partial<Bookmark>): Promise<Bookmark> => {
      return ipcRenderer.invoke('edit-bookmark', bookmark);
    },
    getBookmarksProviders: (): Promise<Provider[]> => {
      return ipcRenderer.invoke('get-bookmarks-providers');
    },
    getBookmarksFromProvider: (provider: Provider): Promise<Bookmark[]> => {
      return ipcRenderer.invoke('get-bookmarks-from-provider', provider);
    },
    importBookmarks: (bookmarks: Partial<Bookmark>[]): Promise<void> => {
      return ipcRenderer.invoke('import-bookmarks', bookmarks);
    },
    getBookmarksTags: (): Promise<Tag[]> => {
      return ipcRenderer.invoke('get-bookmarks-tags');
    },
    isBookmarked: (url: string): Promise<boolean> => {
      return ipcRenderer.invoke('is-bookmarked', url);
    },
    addBookmark: (args: IpcAddBookmark): Promise<Bookmark> => {
      return ipcRenderer.invoke('add-bookmark', args);
    },
    removeBookmark: (url: string): Promise<void> => {
      return ipcRenderer.invoke('remove-bookmark', url);
    },
    getAllBookmarks: (): Promise<Bookmark[]> => {
      return ipcRenderer.invoke('get-all-bookmarks');
    },
  },
  browser: {
    select: (webContentsId: number) => {
      ipcRenderer.send('select-browser', webContentsId);
    },
    selectBrowserView: () => {
      ipcRenderer.send('select-browserView');
    },
    certificateErrorAnswer: (args: IpcCertificateErrorAnswer) => {
      ipcRenderer.send('certificate-error-answer', args);
    },
    requestCapture: (webContentsId: number): Promise<string> => {
      return ipcRenderer.invoke('request-capture', webContentsId);
    },
    getUrlToOpen: (): Promise<string | undefined> => {
      return ipcRenderer.invoke('get-url-to-open');
    },
  },
  config: {
    getAll: () => ipcRenderer.invoke('get-all-store-values'),
    get: <K extends keyof ConfigKeys>(key: K): Promise<ConfigKeys[K]> =>
      ipcRenderer.invoke('get-store-value', key),
    set: <K extends keyof ConfigKeys>(args: {
      key: K;
      value: ConfigKeys[K];
    }): Promise<void> => ipcRenderer.invoke('set-store-value', args),
  },
  download: {
    removeDownload: (id: number): Promise<void> => {
      return ipcRenderer.invoke('remove-download', id);
    },
    addDownload: (args: IpcAddDownload): Promise<void> => {
      return ipcRenderer.invoke('add-download', args);
    },
    getAllDownloads: (): Promise<Download[]> => {
      return ipcRenderer.invoke('get-all-downloads');
    },
    clearDownloads: (): Promise<void> => {
      return ipcRenderer.invoke('clear-downloads');
    },
    hideDownloadsPreview: () => {
      ipcRenderer.send('hide-downloads-preview');
    },
  },
  extension: {
    getAllExtensions: (): Promise<Extension[]> => {
      return ipcRenderer.invoke('get-all-extensions');
    },
    deleteExtension: (id: string): Promise<void> => {
      return ipcRenderer.invoke('delete-extension', id);
    },
    installExtension: (id: string): Promise<void> => {
      return ipcRenderer.invoke('install-extension', id);
    },
  },
  history: {
    addHistory: (args: IpcAddHistory): Promise<History> => {
      return ipcRenderer.invoke('add-history', args);
    },
    findInHistory: (str: string): Promise<History[]> => {
      return ipcRenderer.invoke('find-in-history', str);
    },
    removeHistory: (id: number): Promise<void> => {
      return ipcRenderer.invoke('remove-history', id);
    },
    clearHistory: (): Promise<void> => {
      return ipcRenderer.invoke('clear-history');
    },
    getAllHistory: (): Promise<History[]> => {
      return ipcRenderer.invoke('get-all-history');
    },
  },
  listener: {
    newWindow: (
      action: (event: IpcRendererEvent, args: IpcNewWindow) => void
    ) => {
      ipcRenderer.on('new-window', (event, args) =>
        action(event, args as IpcNewWindow)
      );
    },
    loadBoard: (
      action: (event: IpcRendererEvent, args: IpcLoadBoard) => void
    ) => {
      ipcRenderer.on('load-board', (event, args) =>
        action(event, args as IpcLoadBoard)
      );
    },
    loadSavedBoard: (
      action: (event: IpcRendererEvent, args: IpcLoadSavedBoardCallback) => void
    ) => {
      ipcRenderer.on('load-saved-board-callback', (event, args) =>
        action(event, args as IpcLoadSavedBoardCallback)
      );
    },
    purge: (action: (event: IpcRendererEvent, args: IpcPurge) => void) => {
      ipcRenderer.on('purge', (event, args) => action(event, args as IpcPurge));
    },
    renameBoard: (
      action: (event: IpcRendererEvent, args: IpcRenameBoard) => void
    ) => {
      ipcRenderer.on('rename-board', (event, args) =>
        action(event, args as IpcRenameBoard)
      );
    },
    saveBoard: (
      action: (event: IpcRendererEvent, args: IpcSaveBoard) => void
    ) => {
      ipcRenderer.on('save-board', (event, args) =>
        action(event, args as IpcSaveBoard)
      );
    },
    closeWebview: (
      action: (event: IpcRendererEvent, args: IpcCloseWebview) => void
    ) => {
      ipcRenderer.on('close-webview', (event, args) =>
        action(event, args as IpcCloseWebview)
      );
    },
    closeAllWebview: (
      action: (event: IpcRendererEvent, args: IpcCloseAllWebview) => void
    ) => {
      ipcRenderer.on('close-all-webview', (event, args) =>
        action(event, args as IpcCloseAllWebview)
      );
    },
    closeOthersWebview: (
      action: (event: IpcRendererEvent, args: IpcCloseOthersWebview) => void
    ) => {
      ipcRenderer.on('close-others-webview', (event, args) =>
        action(event, args as IpcCloseOthersWebview)
      );
    },
    showAppMenu: (
      action: (event: IpcRendererEvent, args: IpcShowAppMenu) => void
    ) => {
      ipcRenderer.on('show-app-menu', (event, args) =>
        action(event, args as IpcShowAppMenu)
      );
    },
    certificateError: (
      action: (event: IpcRendererEvent, args: IpcCertificateError) => void
    ) => {
      ipcRenderer.on('certificate-error', (event, args) =>
        action(event, args as IpcCertificateError)
      );
    },
    downloading: (
      action: (event: IpcRendererEvent, args: IpcDownloading) => void
    ) => {
      ipcRenderer.on('downloading', (event, args) =>
        action(event, args as IpcDownloading)
      );
    },
    showDownloadsPreview: (
      action: (event: IpcRendererEvent, args: IpcShowDownloadsPreview) => void
    ) => {
      ipcRenderer.on('show-downloads-preview', (event, args) =>
        action(event, args as IpcShowDownloadsPreview)
      );
    },
    distributeWindowsEvenly: (
      action: (
        event: IpcRendererEvent,
        args: IpcDistributeWindowsEvenly
      ) => void
    ) => {
      ipcRenderer.on('distribute-windows-evenly', (event, args) =>
        action(event, args as IpcDistributeWindowsEvenly)
      );
    },
    setDefaultWindowSize: (
      action: (event: IpcRendererEvent, args: IpcSetDefaultWindowSize) => void
    ) => {
      ipcRenderer.on('set-default-window-size', (event, args) =>
        action(event, args as IpcSetDefaultWindowSize)
      );
    },
    pinWebview: (
      action: (event: IpcRendererEvent, args: IpcPinWebview) => void
    ) => {
      ipcRenderer.on('pin-webview', (event, args) =>
        action(event, args as IpcPinWebview)
      );
    },
    resetBoard: (
      action: (event: IpcRendererEvent, args: IpcResetBoard) => void
    ) => {
      ipcRenderer.on('reset-board', (event, args) =>
        action(event, args as IpcResetBoard)
      );
    },
    autotileWindows: (
      action: (
        event: IpcRendererEvent,
        horizontal: number,
        vertical: number
      ) => void
    ) => {
      ipcRenderer.on('autotile-windows', (event, horizontal, vertical) =>
        action(event, horizontal, vertical)
      );
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
    pinWebview: () => {
      ipcRenderer.removeAllListeners('pin-webview');
    },
    saveBoard: () => {
      ipcRenderer.removeAllListeners('save-board');
    },
    loadSavedBoard: () => {
      ipcRenderer.removeAllListeners('load-saved-board-callback');
    },
    resetBoard: () => {
      ipcRenderer.removeAllListeners('reset-board');
    },
    autotileWindows: () => {
      ipcRenderer.removeAllListeners('autotile-windows');
    },
  },
  tools: {
    inspectElement: (point: IpcInspectElement) => {
      ipcRenderer.send('inspectElement', point);
    },
    toggleDarkMode: () => {
      ipcRenderer.invoke('dark-mode:toggle');
    },
    changeLanguage: (locale: Locale): Promise<TFunction> => {
      return ipcRenderer.invoke('change-language', locale);
    },
    showItemInFolder: (filepath: string) => {
      ipcRenderer.send('show-item-in-folder', filepath);
    },
    showLeftbarContextMenu: (params: IpcShowLeftbarContextMenu) => {
      ipcRenderer.send('show-leftbar-context-menu', params);
    },
    showBoardContextMenu: (params: IpcShowBoardContextMenu) => {
      ipcRenderer.send('show-board-context-menu', params);
    },
    clicked: () => {
      ipcRenderer.send('app-clicked');
    },
    findInKnownDomains: (input: string): Promise<DomainSuggestion[]> => {
      return ipcRenderer.invoke('find-in-known-domains', input);
    },
  },
  os: {
    getPlatform: () => process.platform,
  },
});
