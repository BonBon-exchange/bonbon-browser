/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/prefer-default-export */
import { app, BrowserView, ipcMain, nativeTheme, WebContents } from 'electron';

import { getExtensionsObject } from './extensions';
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

const store = getStore();
const views: Record<string, BrowserView> = {};
const browsers: Record<string, WebContents> = {};

export const getBrowsers = () => browsers;

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
    viewToShow.webContents.on('dom-ready', () =>
      viewToShow.webContents.send('load-board', { boardId: args.tabId })
    );
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
    const view = views[args.tabId];
    if (view) view.webContents.send('purge');
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

  ipcMain.handle('get-store-value', (_event, key) => {
    return store.get(key);
  });

  ipcMain.on('set-store-value', (_e, args) => {
    store.set(args.key, args.value);
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
        'SELECT * FROM history WHERE url LIKE ? GROUP BY url ORDER BY date DESC LIMIT 5',
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
    return new Promise((resolve, _reject) => {
      db.get('SELECT * FROM bookmarks WHERE url = ?', str, (_err, row) =>
        resolve(row !== undefined)
      );
    });
  });

  ipcMain.on('add-bookmark', (_e, args) => {
    db.run(
      'INSERT INTO bookmarks (url, name) VALUES (?, ?)',
      args.url,
      args.title
    );
  });

  ipcMain.on('remove-bookmark', (_e, url) => {
    db.run('DELETE FROM bookmarks WHERE url = ?', url);
  });

  ipcMain.handle('get-all-bookmarks', () => {
    return new Promise((resolve, _reject) => {
      db.all('SELECT * FROM bookmarks', (_err, rows) => resolve(rows));
    });
  });
};
