/* eslint-disable import/prefer-default-export */
export const mockWindow = () => {
  Object.defineProperty(window, 'app', {
    value: {
      app: {
        showTabContextMenu: jest.fn(),
        showBoardContextMenu: jest.fn(),
        getAllExtensions: jest.fn(() => Promise.resolve()),
        deleteExtension: jest.fn(),
        installExtension: jest.fn(),
        hideDownloadsPreview: jest.fn(),
        getBookmarksProviders: jest.fn(() => Promise.resolve()),
        getBookmarksFromProvider: jest.fn(() => Promise.resolve()),
        importBookmarks: jest.fn(),
        getBookmarksTags: jest.fn(() => Promise.resolve()),
        editBookmark: jest.fn(),
      },
      analytics: {
        event: jest.fn(),
      },
      db: {
        addHistory: jest.fn(),
        findInHistory: jest.fn(() => Promise.resolve()),
        removeHistory: jest.fn(),
        getAllHistory: jest.fn(() => Promise.resolve()),
        clearHistory: jest.fn(),
        isBookmarked: jest.fn(() => Promise.resolve()),
        addBookmark: jest.fn(),
        removeBookmark: jest.fn(),
        getAllBookmarks: jest.fn(() => Promise.resolve()),
        addDownload: jest.fn(),
        getAllDownloads: jest.fn(() => Promise.resolve()),
        clearDownloads: jest.fn(),
        removeDownload: jest.fn(),
        findInBookmarks: jest.fn(() => Promise.resolve()),
      },
      config: {
        get: jest.fn(() => Promise.resolve()),
        set: jest.fn(),
      },
      tools: {
        inspectElement: jest.fn(),
        toggleDarkMode: jest.fn(),
        changeLanguage: jest.fn(),
        showItemInFolder: jest.fn(),
      },
      board: {
        open: jest.fn(),
        close: jest.fn(),
        selectNext: jest.fn(),
        setWindowsCount: jest.fn(),
      },
      browser: {
        select: jest.fn(),
        selectBrowserView: jest.fn(),
        certificateErrorAnswser: jest.fn(),
      },
      listener: {
        newWindow: jest.fn(),
        loadBoard: jest.fn(),
        purge: jest.fn(),
        renameBoard: jest.fn(),
        closeWebview: jest.fn(),
        closeAllWebview: jest.fn(),
        closeOthersWebview: jest.fn(),
        showAppMenu: jest.fn(),
        certificateError: jest.fn(),
        downloading: jest.fn(),
        showDownloadsPreview: jest.fn(),
        distributeWindowsEvenly: jest.fn(),
        setDefaultWindowSize: jest.fn(),
      },
      off: {
        newWindow: jest.fn(),
        loadBoard: jest.fn(),
        purge: jest.fn(),
        renameBoard: jest.fn(),
        closeWebview: jest.fn(),
        closeAllWebview: jest.fn(),
        closeOthersWebview: jest.fn(),
        showAppMenu: jest.fn(),
        certificateError: jest.fn(),
        downloading: jest.fn(),
        showDownloadsPreview: jest.fn(),
        distributeWindowsEvenly: jest.fn(),
        setDefaultWindowSize: jest.fn(),
      },
    },
  });

  Object.defineProperty(window, 'darkmode', {
    value: {
      toggle: jest.fn(),
      system: jest.fn(),
    },
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.scrollBy = jest.fn();
};
