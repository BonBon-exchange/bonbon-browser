import { EventParams } from "types/analytics";
import { Bookmark, Provider, Tag } from "types/bookmarks";
import { Download } from "types/downloads";
import { Extension } from "types/extensions";
import { History } from "types/history";
import { Locale } from "types/i18n";
import {
  IpcAddBookmark,
  IpcAddDownload,
  IpcAddHistory,
  IpcCertificateErrorAnswer,
  IpcInspectElement,
  IpcSetStoreValue,
  IpcSetWindowsCount,
  IpcShowBoardContextMenu,
  IpcShowLeftbarContextMenu
} from "types/ipc";
import { DomainSuggestion } from "types/suggestions";

declare global {
  interface Window {
    app: {
      analytics: {
        event: (eventName: string, params?: EventParams) => void;
      };
      board: {
        close: () => void;
        selectNext: () => void;
        setWindowsCount: (args: IpcSetWindowsCount) => void;
      };
      bookmark: {
        importBookmarks: (bookmarks: Partial<Bookmark>[]) => Promise<void>;
        getBookmarksTags: () => Promise<Tag[]>;
        editBookmark: (bookmark: Partial<Bookmark>) => Promise<Bookmark>;
        getBookmarksProviders: () => Promise<Provider[]>;
        getBookmarksFromProvider: (provider: Provider) => Promise<Bookmark[]>;
        isBookmarked: (url: string) => Promise<boolean>;
        addBookmark: (args: IpcAddBookmark) => void;
        removeBookmark: (url: string) => void;
        getAllBookmarks: () => Promise<Bookmark[]>;
        findInBookmarks: (str: string) => Promise<any>;
      };
      browser: {
        select: (webContentsId: number) => void;
        selectBrowserView: () => void;
        certificateErrorAnswer: (args: IpcCertificateErrorAnswer) => void;
        requestCapture: (webContentsId: number) => Promise<string>;
        getUrlToOpen: () => Promise<string | undefined>;
      };
      config: {
        get: (key: string) => Promise<unknown>;
        set: (args: IpcSetStoreValue) => void;
      };
      download: {
        hideDownloadsPreview: () => void;
        addDownload: (args: IpcAddDownload) => void;
        getAllDownloads: () => Promise<Download[]>;
        clearDownloads: () => void;
        removeDownload: (id: number) => void;
      };
      extension: {
        getAllExtensions: () => Promise<Extension[]>;
        deleteExtension: (id: string) => void;
        installExtension: (id: string) => void;
      };
      history: {
        addHistory: (args: IpcAddHistory) => void;
        findInHistory: (str: string) => Promise<History[]>;
        removeHistory: (id: number) => void;
        clearHistory: () => void;
        getAllHistory: () => Promise<History[]>;
      };
      listener: {
        newWindow: (action: unknown) => void;
        loadBoard: (action: unknown) => void;
        purge: (action: unknown) => void;
        showLibrary: (action: unknown) => void;
        showSettings: (action: unknown) => void;
        saveBoard: (action: unknown) => void;
        renameBoard: (action: unknown) => void;
        closeWebview: (action: unknown) => void;
        closeAllWebview: (action: unknown) => void;
        closeOthersWebview: (action: unknown) => void;
        showAppMenu: (action: unknown) => void;
        certificateError: (action: unknown) => void;
        downloading: (action: unknown) => void;
        showDownloadsPreview: (action: unknown) => void;
        distributeWindowsEvenly: (action: unknown) => void;
        setDefaultWindowSize: (action: unknown) => void;
      };
      off: {
        newWindow: () => void;
        loadBoard: () => void;
        showLibrary: () => void;
        showSettings: () => void;
        purge: () => void;
        saveBoard: () => void;
        renameBoard: () => void;
        closeWebview: () => void;
        closeAllWebview: () => void;
        closeOthersWebview: () => void;
        showAppMenu: () => void;
        certificateError: () => void;
        downloading: () => void;
        showDownloadsPreview: () => void;
        distributeWindowsEvenly: () => void;
        setDefaultWindowSize: () => void;
      };
      tools: {
        inspectElement: (point: IpcInspectElement) => void;
        toggleDarkMode: () => void;
        changeLanguage: (locale: Locale) => void;
        showItemInFolder: (filepath: string) => void;
        showLeftbarContextMenu: (params: IpcShowLeftbarContextMenu) => void;
        showBoardContextMenu: (params: IpcShowBoardContextMenu) => void;
        clicked: () => void;
        findInKnownDomains: (input: string) => Promise<DomainSuggestion[]>;
      };
    };
  }
}

export {};
