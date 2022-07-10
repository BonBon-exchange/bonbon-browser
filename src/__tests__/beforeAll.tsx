/* eslint-disable import/prefer-default-export */
export const mockWindow = () => {
  Object.defineProperty(window, 'app', {
    value: {
      analytics: {
        event: jest.fn(),
      },
      db: {
        addHistory: jest.fn(),
        findInHistory: jest.fn(),
      },
      config: {
        get: jest.fn(),
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
