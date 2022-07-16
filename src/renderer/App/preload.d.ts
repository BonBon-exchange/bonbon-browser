declare global {
  interface Window {
    app: {
      app: {
        showLeftbarContextMenu: (params: { x: number; y: number }) => void;
        showBoardContextMenu: (params: { x: number; y: number }) => void;
      },
      analytics: {
        event: (eventName: string, params?: Record<string, string>) => void;
      };
      db: {
        addHistory: (args: {url: string, title: string}) => void;
        findInHistory: (str: string) => Promise<any>;
        removeHistory: (id: number) => void;
        clearHistory: () => void;
        getAllHistory: () => Promise<any>;
        isBookmarked: (url: string) => Promise<boolean>;
        addBookmark: (args: { title: string; url: string }) => void;
        removeBookmark: (url: string) => void;
        getAllBookmarks: () => Promise<any>;
        addDownload: (args: {savePath: string, filename: string, startTime: number}) => void;
        getAllDownloads: () => Promise<any>;
        clearDownloads: () => void;
        removeDownload: (id: number) => void;
      };
      config: {
        get: (key: string) => Promise<unknown>;
        set: (args: {key: string, value: unknown}) => void;
      }
      tools: {
        inspectElement: (point: { x: number; y: number }) => void;
        toggleDarkMode: () => void;
        changeLanguage: (locale: string) => void;
        showItemInFolder: (filepath: string) => void;
      };
      board: {
        open: (board: {
          id: string;
          label: string;
          isFullSize: boolean;
        }) => void;
        close: () => void;
        selectNext: () => void;
        setWindowsCount: (args: { boardId: string; count: number }) => void;
      };
      browser: {
        select: (webContentsId: number) => void;
        selectBrowserView: () => void;
        certificateErrorAnswser: (args: { webContentsId: number, fingerprint: string, isTrusted: boolean }) => void;
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
      };
    };
    darkMode: {
      toggle: () => void;
      system: () => void;
    };
  }
}

export {};
