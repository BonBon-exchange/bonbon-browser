declare global {
  interface Window {
    app: {
      analytics: {
        event: (eventName: string, params?: Record<string, string>) => void;
      };
      db: {
        addHistory: (url: string) => void;
      };
      config: {
        get: (key: string) => Promise<unknown>;
        set: (args: {key: string, value: unknown}) => void;
      }
      tools: {
        inspectElement: (point: { x: number; y: number }) => void;
        toggleDarkMode: () => void;
        changeLanguage: (locale: string) => void;
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
        select: (webContentsId: string) => void;
        selectBrowserView: () => void;
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
      };
    };
    darkMode: {
      toggle: () => void;
      system: () => void;
    };
  }
}

export {};
