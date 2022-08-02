/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/prefer-default-export */
import {
  app,
  BrowserView,
  ipcMain,
  nativeTheme,
  shell,
  WebContents,
  Menu,
  BrowserWindow,
} from 'electron';
import AutoLaunch from 'easy-auto-launch';

import {
  getExtensionsObject,
  getAllExtensions,
  deleteExtension,
  installExtension,
} from './extensions';
import { event } from './analytics';
import {
  createBrowserView,
  getMainWindow,
  getSelectedView,
  setBrowserViewBonds,
  setSelectedView,
} from './browser';
import { getStore } from './store';
import i18n from './i18n';
import db from './db';
import {
  getBookmarksProviders,
  getBookmarksFromProvider,
  importBookmarks,
  isBookmarked,
  removeBookmark,
  getAllBookmarks,
  getBookmarksTags,
  editBookmark,
} from './bookmarks';

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

  ipcMain.on('inspectElement', (e, args) => {
    e.sender.inspectElement(args.x, args.y);
  });

  ipcMain.on('analytics', (_event, args) => {
    event(args.eventName, args.params);
  });

  ipcMain.on('tab-select', (_event, args) => {
    const viewToShow: BrowserView = views[args.tabId]
      ? views[args.tabId]
      : createBrowserView();
    views[args.tabId] = viewToShow;
    getMainWindow()?.setTopBrowserView(viewToShow);
    viewToShow.webContents.send('load-board', { boardId: args.tabId });
    viewToShow.webContents.on('dom-ready', () => {
      const interv = setInterval(() => {
        try {
          viewToShow.webContents.send('load-board', { boardId: args.tabId });
        } catch (e) {
          console.log(e);
          clearInterval(interv);
        }
      }, 100);

      setTimeout(() => {
        if (interv) clearInterval(interv);
      }, 10000);
    });
    setSelectedView(viewToShow);
    getSelectedView()?.webContents.focus();
  });

  ipcMain.on('open-board', (_event, args) => {
    getMainWindow()?.webContents.send('open-tab', args);

    const viewToShow: BrowserView = views[args.boardId]
      ? views[args.boardId]
      : createBrowserView();
    views[args.boardId] = viewToShow;
    getMainWindow()?.setTopBrowserView(viewToShow);
    viewToShow.webContents.on('dom-ready', () => {
      viewToShow.webContents.send('load-board', { boardId: args.id });
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

  ipcMain.on('tab-purge', (_event, args) => {
    const view = views[args.tabId] as any;
    if (view) {
      view.webContents.send('purge');
      getMainWindow()?.removeBrowserView(view);
      view.webContents.destroy();
    }
    delete views[args.tabId];
  });

  ipcMain.on('save-tab', (_event, args) => {
    const view = views[args.tabId];
    if (view) view.webContents.send('save-board');
  });

  ipcMain.on('rename-tab', (_event, args) => {
    const view = views[args.tabId];
    if (view) view.webContents.send('rename-board', { label: args.label });
  });

  ipcMain.on('select-browser', (_event, webContentsId) => {
    if (browsers[webContentsId]) extensions.selectTab(browsers[webContentsId]);
  });

  ipcMain.on('select-browserView', () => {
    const selectedView = getSelectedView();
    if (selectedView) extensions.selectTab(selectedView.webContents);
  });

  ipcMain.on('select-next-board', () => {
    getMainWindow()?.webContents.send('select-next-board');
  });

  ipcMain.on('set-windows-count', (_event, args) => {
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

  ipcMain.handle('get-store-value', (_event, key) => {
    return store.get(key);
  });

  ipcMain.on('set-store-value', (_e, args) => {
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

  ipcMain.on('change-language', (_e, locale) => {
    i18n.changeLanguage(locale);
  });

  ipcMain.on('add-history', (_e, args) => {
    db.run(
      'INSERT INTO history (url, date, title) VALUES (?, datetime("now", "localtime"), ?)',
      args.url,
      args.title
    );
  });

  ipcMain.on('remove-history', (_e, id) => {
    db.run('DELETE FROM history WHERE id = ?', id);
  });

  ipcMain.on('clear-history', () => {
    db.run('DELETE FROM history');
  });

  ipcMain.handle('find-in-history', (_e, str) => {
    return new Promise((resolve, _reject) => {
      db.all(
        'SELECT * FROM history WHERE url LIKE ? GROUP BY url ORDER BY date DESC LIMIT 20',
        `%${str}%`,
        (err, rows) => resolve({ err, rows })
      );
    });
  });

  ipcMain.handle('get-all-history', (_e) => {
    return new Promise((resolve, _reject) => {
      db.all('SELECT * FROM history ORDER BY date DESC', (_err, rows) =>
        resolve(rows)
      );
    });
  });

  ipcMain.handle('is-bookmarked', (_e, str) => {
    return isBookmarked(str);
  });

  ipcMain.on('add-bookmark', (_e, args) => {
    db.run(
      'INSERT INTO bookmarks (url, name) VALUES (?, ?)',
      args.url,
      args.title
    );
  });

  ipcMain.on('remove-bookmark', (_e, url) => {
    removeBookmark(url);
  });

  ipcMain.handle('get-all-bookmarks', () => {
    return getAllBookmarks();
  });

  ipcMain.on('certificate-error-answser', (_e, args) => {
    if (args.isTrusted) {
      certificateErrorAuth.push({
        webContentsId: args.webContentsId,
        fingerprint: args.fingerprint,
      });
    }
  });

  ipcMain.on('show-item-in-folder', (_e, filepath) => {
    shell.showItemInFolder(filepath);
  });

  ipcMain.on('add-download', (_e, args) => {
    db.get(
      'SELECT * FROM downloads WHERE savePath = ? AND startTime = ?',
      args.savePath,
      args.startTime,
      (_err: unknown, row: unknown) => {
        if (!row) {
          db.run(
            'INSERT INTO downloads (savePath, filename, date, startTime) VALUES (?, ?, datetime("now", "localtime"), ?)',
            args.savePath,
            args.filename,
            args.startTime
          );
        }
      }
    );
  });

  ipcMain.handle('get-all-downloads', () => {
    return new Promise((resolve, _reject) => {
      db.all('SELECT * FROM downloads ORDER BY date DESC', (_err, rows) =>
        resolve(rows)
      );
    });
  });

  ipcMain.on('clear-downloads', () => {
    db.run('DELETE FROM downloads');
  });

  ipcMain.on('remove-download', (_e, id) => {
    db.run('DELETE FROM downloads WHERE id = ?', id);
  });

  ipcMain.on('show-tab-context-menu', (e, params: { x: number; y: number }) => {
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
  });

  ipcMain.on(
    'show-leftbar-context-menu',
    (e, params: { x: number; y: number }) => {
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
    (e, params: { x: number; y: number }) => {
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

  ipcMain.handle('get-all-extensions', () => {
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

  ipcMain.handle('get-bookmarks-providers', () => {
    return new Promise((resolve) => {
      const bp = getBookmarksProviders();
      resolve(bp);
    });
  });

  ipcMain.handle('get-bookmarks-from-provider', (_e: any, provider: string) => {
    return new Promise((resolve) => {
      const bookmarks = getBookmarksFromProvider(provider);
      resolve(bookmarks);
    });
  });

  ipcMain.on('import-bookmarks', (_e, bookmarks: any[]) => {
    importBookmarks(bookmarks);
  });

  ipcMain.handle('get-bookmarks-tags', () => {
    return getBookmarksTags();
  });

  ipcMain.on('edit-bookmark', (_e, bookmark: any) => {
    editBookmark(bookmark);
  });

  ipcMain.handle('find-in-bookmarks', (_e, str) => {
    return new Promise((resolve, _reject) => {
      db.all(
        'SELECT * FROM bookmarks WHERE url LIKE ? GROUP BY url ORDER BY id DESC LIMIT 5',
        `%${str}%`,
        (err, rows) => resolve({ err, rows })
      );
    });
  });

  ipcMain.handle('request-capture', (_e, wcId: number) => {
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
};
