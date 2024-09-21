import { TFunction } from 'react-i18next';
import { EventParams } from 'types/analytics';
import { Bookmark, Provider, Tag } from 'types/bookmarks';
import { Download } from 'types/downloads';
import { Extension } from 'types/extensions';
import { History } from 'types/history';
import { Locale } from 'types/i18n';
import {
  IpcAddBookmark,
  IpcAddDownload,
  IpcAddHistory,
  IpcCertificateErrorAnswer,
  IpcInspectElement,
  IpcSetStoreValue,
  IpcSetWindowsCount,
  IpcShowBoardContextMenu,
  IpcShowLeftbarContextMenu,
} from 'types/ipc';
import { DomainSuggestion } from 'types/suggestions';
import { Board } from 'types/boards';
import { DownloadState } from 'renderer/TitleBar/components/TopBar/Types';

declare global {
  interface Window {
    app: {
      analytics: {
        event: (eventName: string, params?: EventParams) => void;
        page: (pageName: string, params?: EventParams) => void;
      };
      board: {
        close: () => void;
        add: (params?: { newSession?: boolean }) => void;
        selectNext: () => void;
        setWindowsCount: (args: IpcSetWindowsCount) => void;
        getAllBoards: () => Promise<
          { id: string; boardId: string; content: string }[]
        >;
        save: (board: Board) => void;
        delete: (boardId: string) => void;
        load: (board: Board) => void;
      };
      bookmark: {
        importBookmarks: (bookmarks: Partial<Bookmark>[]) => Promise<void>;
        getBookmarksTags: () => Promise<Tag[]>;
        editBookmark: (bookmark: Partial<Bookmark>) => Promise<Bookmark>;
        getBookmarksProviders: () => Promise<Provider[]>;
        getBookmarksFromProvider: (provider: Provider) => Promise<Bookmark[]>;
        isBookmarked: (url: string) => Promise<boolean>;
        addBookmark: (args: IpcAddBookmark) => Promise<Bookmark>;
        removeBookmark: (url: string) => Promise<void>;
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
        getAll: () => Promise<Record<string, any>>;
        get: (key: string) => Promise<unknown>;
        set: (args: IpcSetStoreValue) => Promise<void>;
      };
      download: {
        hideDownloadsPreview: () => void;
        addDownload: (args: IpcAddDownload) => Promise<void>;
        getAllDownloads: () => Promise<Download[]>;
        clearDownloads: () => Promise<void>;
        removeDownload: (id: number) => Promise<void>;
      };
      extension: {
        getAllExtensions: () => Promise<Extension[]>;
        deleteExtension: (id: string) => Promise<void>;
        installExtension: (id: string) => Promise<void>;
      };
      history: {
        addHistory: (args: IpcAddHistory) => Promise<History>;
        findInHistory: (str: string) => Promise<History[]>;
        removeHistory: (id: number) => Promise<void>;
        clearHistory: () => Promise<void>;
        getAllHistory: () => Promise<History[]>;
      };
      listener: {
        newWindow: (
          action: (_e: IpcRendererEvent, args: { url: string }) => void
        ) => void;
        loadBoard: (
          action: (_e: any, args: { boardId: string }) => void
        ) => void;
        loadSavedBoard: (
          action: (_e: any, args: { boardId: string; board?: Board }) => void
        ) => void;
        purge: (action: () => void) => void;
        saveBoard: (action: (_e: any, args: { tabId: string }) => void) => void;
        renameBoard: (
          action: (_e: IpcRendererEvent, args: { label: string }) => void
        ) => void;
        closeWebview: (
          action: (_e: IpcRendererEvent, args: Position) => void
        ) => void;
        pinWebview: (
          action: (_e: IpcRendererEvent, args: Position) => void
        ) => void;
        closeAllWebview: (action: () => void) => void;
        closeOthersWebview: (
          action: (_e: IpcRendererEvent, args: Position) => void
        ) => void;
        showAppMenu: (action: () => void) => void;
        certificateError: (
          action: (
            _e: IpcRendererEvent,
            args: { webContentsId: number; fingerprint: string }
          ) => void
        ) => void;
        downloading: (
          action: (
            _e: IpcRendererEvent,
            args: {
              savePath: string;
              filename: string;
              progress: number;
              etag: string;
              startTime: number;
              state: DownloadState;
            }
          ) => void
        ) => void;
        showDownloadsPreview: (action: () => void) => void;
        distributeWindowsEvenly: (action: () => void) => void;
        setDefaultWindowSize: (
          action: (_e: IpcRendererEvent, wcId: number) => void
        ) => void;
        resetBoard: (
          action: (_e: IpcRendererEvent, boardId?: string) => void
        ) => void;
      };
      off: {
        newWindow: () => void;
        loadBoard: () => void;
        loadSavedBoard: () => void;
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
        pinWebview: () => void;
        resetBoard: () => void;
      };
      os: {
        getPlatform: () => string;
      };
      tools: {
        inspectElement: (point: IpcInspectElement) => void;
        toggleDarkMode: () => void;
        changeLanguage: (locale: Locale) => Promise<TFunction>;
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
