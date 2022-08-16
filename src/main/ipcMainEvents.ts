/* eslint-disable promise/always-return */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/prefer-default-export */
import AutoLaunch from 'easy-auto-launch';
import {
  app,
  BrowserView,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  Menu,
  nativeTheme,
  shell,
  WebContents,
} from 'electron';

import { Bookmark, Provider as BookmarkProvider, Tag } from 'types/bookmarks';
import { Download } from 'types/downloads';
import { Extension } from 'types/extensions';
import { History } from 'types/history';
import { Locale } from 'types/i18n';
import {
  IpcAddBookmark,
  IpcAddDownload,
  IpcAddHistory,
  IpcAnalytics,
  IpcCertificateErrorAnswer,
  IpcInspectElement,
  IpcRenameTab,
  IpcSaveTab,
  IpcSetStoreValue,
  IpcSetWindowsCount,
  IpcShowBoardContextMenu,
  IpcShowLeftbarContextMenu,
  IpcShowTabContextMenu,
  IpcTabPurge,
  IpcTabSelect,
} from 'types/ipc';
import { DomainSuggestion } from 'types/suggestions';

import { event } from './analytics';
import { getUrlToOpen, setUrlToOpen } from './appEvents';
import {
  editBookmark,
  getAllBookmarks,
  getBookmarksFromProvider,
  getBookmarksProviders,
  getBookmarksTags,
  importBookmarks,
  isBookmarked,
  removeBookmark,
  addBookmark,
  findBookmarksByDomain,
  findInBookmarks,
} from './bookmarks';
import {
  createBrowserView,
  getMainWindow,
  getSelectedView,
  setBrowserViewBonds,
  setSelectedView,
} from './browser';
import db from './db';
import {
  addDownload,
  clearDownloads,
  getAllDownloads,
  removeDownload,
} from './downloads';
import {
  deleteExtension,
  getAllExtensions,
  getExtensionsObject,
  installExtension,
} from './extensions';
import {
  addHistory,
  clearHistory,
  findHistoryByDomain,
  findInHistory,
  getAllHistory,
  removeHistory,
} from './history';
import i18n from './i18n';
import { getStore } from './store';

const store = getStore();
const views: Record<string, BrowserView> = {};
const browsers: Record<string, WebContents> = {};
const certificateErrorAuth: { webContentsId: number; fingerprint: string }[] =
  [];

export const getBrowsers = () => browsers;

export const getCertificateErrorAuth = (
  webContentsId: number,
  fingerprint: string
) => {
  const auth = certificateErrorAuth.find(
    (c) => c.webContentsId === webContentsId && c.fingerprint === fingerprint
  );
  return !!auth;
};

const bonbonAutoLauncher = new AutoLaunch({
  name: 'BonBon',
});

export const makeIpcMainEvents = (): void => {
  const extensions = getExtensionsObject();
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });

  ipcMain.on('inspectElement', (e: IpcMainEvent, args: IpcInspectElement) => {
    e.sender.inspectElement(args.x, args.y);
  });

  ipcMain.on('analytics', (_event, args: IpcAnalytics) => {
    event(args.eventName, args.params);
  });

  ipcMain.on('tab-select', (_event, args: IpcTabSelect) => {
    const viewToShow: BrowserView = views[args.tabId]
      ? views[args.tabId]
      : createBrowserView();
    views[args.tabId] = viewToShow;
    getMainWindow()?.setTopBrowserView(viewToShow);
    viewToShow.webContents.send('load-board', {
      boardId: args.tabId,
    });
    viewToShow.webContents.on('dom-ready', () => {
      const interval = setInterval(() => {
        try {
          viewToShow.webContents.send('load-board', {
            boardId: args.tabId,
          });
        } catch (e) {
          console.log(e);
          clearInterval(interval);
        }
      }, 100);

      setTimeout(() => {
        if (interval) clearInterval(interval);
      }, 10000);
    });
    setSelectedView(viewToShow);
    getSelectedView()?.webContents.focus();
  });

  ipcMain.on('close-active-board', () => {
    getMainWindow()?.webContents.send('close-active-tab');
  });

  ipcMain.on('show-library', () => {
    getSelectedView()?.webContents.send('show-library');
  });

  ipcMain.on('show-settings', () => {
    getSelectedView()?.webContents.send('show-settings');
  });

  ipcMain.on('tab-purge', (_event, args: IpcTabPurge) => {
    const view = views[args.tabId] as any;
    if (view) {
      view.webContents.send('purge');
      getMainWindow()?.removeBrowserView(view);
      view.webContents.destroy();
    }
    delete views[args.tabId];
  });

  ipcMain.on('save-tab', (_event, args: IpcSaveTab) => {
    const view = views[args.tabId];
    if (view) view.webContents.send('save-board');
  });

  ipcMain.on('rename-tab', (_event, args: IpcRenameTab) => {
    const view = views[args.tabId];
    if (view) view.webContents.send('rename-board', { label: args.label });
  });

  ipcMain.on('select-browser', (_event, webContentsId: string) => {
    if (browsers[webContentsId]) extensions.selectTab(browsers[webContentsId]);
  });

  ipcMain.on('select-browserView', () => {
    const selectedView = getSelectedView();
    if (selectedView) extensions.selectTab(selectedView.webContents);
  });

  ipcMain.on('select-next-board', () => {
    getMainWindow()?.webContents.send('select-next-board');
  });

  ipcMain.on('set-windows-count', (_event, args: IpcSetWindowsCount) => {
    getMainWindow()?.webContents.send('set-windows-count', args);
  });

  ipcMain.on('close-app', () => {
    event('close_app');
    app.quit();
  });

  ipcMain.on('minimize-app', () => {
    getMainWindow()?.minimize();
  });

  ipcMain.on('maximize-app', () => {
    const mainWindow = getMainWindow();
    mainWindow?.isMaximized()
      ? mainWindow.unmaximize()
      : mainWindow?.maximize();

    const view = getSelectedView();
    if (view) setBrowserViewBonds(view, false);
  });

  ipcMain.on('show-app-menu', () => {
    getSelectedView()?.webContents.send('show-app-menu');
  });

  ipcMain.on('show-downloads-preview', () => {
    getSelectedView()?.webContents.send('show-downloads-preview');
  });

  ipcMain.handle('get-store-value', (_event, key: string) => {
    return store.get(key);
  });

  ipcMain.on('set-store-value', (_e, args: IpcSetStoreValue) => {
    store.set(args.key, args.value);

    switch (args.key) {
      default:
        break;

      case 'application.launchAtStartup':
        args.value === true
          ? bonbonAutoLauncher.enable().catch(console.log)
          : bonbonAutoLauncher.disable().catch(console.log);
        break;
    }
  });

  ipcMain.on('change-language', (_e, locale: Locale) => {
    i18n.changeLanguage(locale);
  });

  ipcMain.on('add-history', (_e, args: IpcAddHistory) => {
    addHistory(args);
  });

  ipcMain.on('remove-history', (_e, id: number) => {
    removeHistory(id);
  });

  ipcMain.on('clear-history', () => {
    clearHistory();
  });

  ipcMain.handle('find-in-history', (_e, str: string): Promise<History[]> => {
    return findInHistory(str);
  });

  ipcMain.handle('get-all-history', (_e): Promise<History[]> => {
    return getAllHistory();
  });

  ipcMain.handle('is-bookmarked', (_e, str: string): Promise<boolean> => {
    return isBookmarked(str);
  });

  ipcMain.on('add-bookmark', (_e, args: IpcAddBookmark) => {
    addBookmark(args);
  });

  ipcMain.on('remove-bookmark', (_e, url: string) => {
    removeBookmark(url);
  });

  ipcMain.handle('get-all-bookmarks', () => {
    return getAllBookmarks();
  });

  ipcMain.on(
    'certificate-error-answer',
    (_e, args: IpcCertificateErrorAnswer) => {
      if (args.isTrusted) {
        certificateErrorAuth.push({
          webContentsId: args.webContentsId,
          fingerprint: args.fingerprint,
        });
      }
    }
  );

  ipcMain.on('show-item-in-folder', (_e, filepath: string) => {
    shell.showItemInFolder(filepath);
  });

  ipcMain.on('add-download', (_e, args: IpcAddDownload): void => {
    addDownload(args);
  });

  ipcMain.handle('get-all-downloads', (): Promise<Download[]> => {
    return getAllDownloads();
  });

  ipcMain.on('clear-downloads', () => {
    clearDownloads();
  });

  ipcMain.on('remove-download', (_e, id: number) => {
    removeDownload(id);
  });

  ipcMain.on(
    'show-tab-context-menu',
    (e, params: IpcShowTabContextMenu): void => {
      const mainWindow = getMainWindow();
      const template = [
        {
          label: i18n.t('Close tab'),
          click: () => {
            mainWindow?.webContents.send('close-tab', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          label: i18n.t('Close all tabs'),
          click: () => {
            mainWindow?.webContents.send('close-all-tab');
          },
        },
        {
          label: i18n.t('Close others tabs'),
          click: () => {
            mainWindow?.webContents.send('close-others-tab', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          label: i18n.t('Rename tab'),
          click: () => {
            mainWindow?.webContents.send('rename-tab', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          type: 'separator',
        },
        {
          label: i18n.t('Inspect element'),
          click: () => {
            e.sender.inspectElement(params.x, params.y);
          },
        },
      ];

      // @ts-ignore
      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: BrowserWindow.fromWebContents(e.sender) || undefined,
      });
    }
  );

  ipcMain.on(
    'show-leftbar-context-menu',
    (e, params: IpcShowLeftbarContextMenu): void => {
      const selectedView = getSelectedView();
      const template = [
        {
          label: i18n.t('Close window'),
          click: () => {
            selectedView?.webContents.send('close-webview', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          label: i18n.t('Close all windows'),
          click: () => {
            selectedView?.webContents.send('close-all-webview');
          },
        },
        {
          label: i18n.t('Close others windows'),
          click: () => {
            selectedView?.webContents.send('close-others-webview', {
              x: params.x,
              y: params.y,
            });
          },
        },
        {
          type: 'separator',
        },
        {
          label: i18n.t('Inspect element'),
          click: () => {
            e.sender.inspectElement(params.x, params.y);
          },
        },
      ];

      // @ts-ignore
      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: BrowserWindow.fromWebContents(e.sender) || undefined,
      });
    }
  );

  ipcMain.on(
    'show-board-context-menu',
    (e, params: IpcShowBoardContextMenu): void => {
      const selectedView = getSelectedView();
      const template = [
        {
          label: i18n.t('Distribute windows evenly'),
          click: () => {
            selectedView?.webContents.send('distribute-windows-evenly');
          },
        },
        {
          type: 'separator',
        },
        {
          label: i18n.t('Inspect element'),
          click: () => {
            e.sender.inspectElement(params.x, params.y);
          },
        },
      ];

      // @ts-ignore
      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: BrowserWindow.fromWebContents(e.sender) || undefined,
      });
    }
  );

  ipcMain.handle('get-all-extensions', (): Promise<Extension[]> => {
    return new Promise((resolve) => {
      const allExts = getAllExtensions();
      resolve(allExts);
    });
  });

  ipcMain.on('delete-extension', (_e, id: string) => {
    deleteExtension(id);
  });

  ipcMain.on('install-extension', (_e, id: string) => {
    installExtension(id);
  });

  ipcMain.on('hide-downloads-preview', () => {
    const mainWindow = getMainWindow();
    mainWindow?.webContents.send('hide-downloads-preview');
  });

  ipcMain.handle('get-bookmarks-providers', (): Promise<BookmarkProvider[]> => {
    return new Promise((resolve) => {
      const bp = getBookmarksProviders();
      resolve(bp);
    });
  });

  ipcMain.handle(
    'get-bookmarks-from-provider',
    (_e: any, provider: BookmarkProvider): Promise<Bookmark[]> => {
      return new Promise((resolve) => {
        const bookmarks = getBookmarksFromProvider(provider);
        resolve(bookmarks);
      });
    }
  );

  ipcMain.on('import-bookmarks', (_e, bookmarks: Partial<Bookmark>[]) => {
    importBookmarks(bookmarks);
  });

  ipcMain.handle('get-bookmarks-tags', (): Promise<Tag[]> => {
    return getBookmarksTags();
  });

  ipcMain.on('edit-bookmark', (_e, bookmark: Partial<Bookmark>) => {
    editBookmark(bookmark);
  });

  ipcMain.handle(
    'find-in-bookmarks',
    (_e, str: string): Promise<Bookmark[]> => {
      return findInBookmarks(str);
    }
  );

  ipcMain.handle('request-capture', (_e, wcId: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (browsers[wcId]) {
        browsers[wcId]
          .capturePage()
          .then((img) => {
            return resolve(img.resize({ width: 185 }).toDataURL());
          })
          .catch(reject);
      } else {
        reject(new Error('WebContentId does not exists.'));
      }
    });
  });

  ipcMain.on('app-clicked', () => {
    getMainWindow()?.webContents.send('app-clicked');
  });

  ipcMain.handle('get-url-to-open', (): Promise<string | undefined> => {
    return new Promise((resolve) => {
      const urlToOpen = getUrlToOpen();
      setUrlToOpen(undefined);
      resolve(urlToOpen);
    });
  });

  ipcMain.handle(
    'find-in-known-domains',
    (_e, input: string): Promise<DomainSuggestion[]> => {
      return new Promise((resolve, reject) => {
        Promise.all([findBookmarksByDomain(input), findHistoryByDomain(input)])
          .then((res) => {
            const result = res.flat();
            resolve(result);
          })
          .catch((e) =>
            reject(new Error(`Error while looking for domains: ${e.message}`))
          );
      });
    }
  );
};
