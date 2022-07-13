/* eslint-disable import/prefer-default-export */
export const mockWindow = () => {
  Object.defineProperty(window, 'app', {
    value: {
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
      },
      config: {
        get: jest.fn(() => Promise.resolve()),
        set: jest.fn(),
      },
      tools: {
        inspectElement: jest.fn(),
        toggleDarkMode: jest.fn(),
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
