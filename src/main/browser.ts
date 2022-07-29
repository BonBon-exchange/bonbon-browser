/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/no-cycle */
import electron, { BrowserView, BrowserWindow, app } from 'electron';
import path from 'path';
import { machineIdSync } from 'node-machine-id';

import { getExtensionsObject, installDevtoolsExtensions } from './extensions';
import { resolveHtmlPath } from './util';
import { event } from './analytics';

const machineId = machineIdSync();

let selectedView: BrowserView | null = null;
let freeView: BrowserView | null = null;
let mainWindow: BrowserWindow | null = null;

export const getSelectedView = () => selectedView;
export const getFreeView = () => freeView;
export const setFreeView = (view: BrowserView) => {
  freeView = view;
};
export const setSelectedView = (view: BrowserView) => {
  selectedView = view;
};

export const getMainWindow = () => mainWindow;

export const setBrowserViewBonds = (
  view: BrowserView,
  isFullScreen: boolean
) => {
  const sizes = mainWindow?.getSize();
  const width = sizes && sizes[0] ? sizes[0] : 0;
  const height = sizes && sizes[1] ? sizes[1] : 0;
  let bWidth;
  let bHeight;
  let bY;

  if (isFullScreen) {
    bWidth = width;
    bHeight = height;
    bY = 0;
  } else {
    bWidth = width - 15;
    bHeight = height - 45;
    bY = 30;
  }

  if (!isFullScreen && !mainWindow?.isMaximized()) {
    bWidth = width;
    bHeight = height - 30;
  }

  view.setBounds({ x: 0, y: bY, width: bWidth, height: bHeight });
};

const createFreeBrowserView = () => {
  const view = new BrowserView({
    webPreferences: {
      partition: 'persist:user-partition',
      sandbox: true,
      webviewTag: true,
      safeDialogs: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'appPreload.js')
        : path.join(__dirname, '../../.erb/dll/app.preload.js'),
    },
  });

  mainWindow?.addBrowserView(view);
  setBrowserViewBonds(view, false);
  view.setAutoResize({ width: true, height: true });
  view.webContents.loadURL(resolveHtmlPath('index.html'));
  return view;
};

export const createBrowserView = (): BrowserView => {
  const tmpView = getFreeView();
  const view = tmpView || createFreeBrowserView();
  setFreeView(createFreeBrowserView());

  if (!app.isPackaged) view.webContents.toggleDevTools();
  const extensions = getExtensionsObject();
  if (mainWindow) extensions.addTab(view.webContents, mainWindow);
  view.webContents.focus();
  return view;
};

export const createWindow = async (): Promise<void> => {
  if (!app.isPackaged) {
    await installDevtoolsExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    show: false,
    width: process.platform === 'darwin' ? width : 1024,
    height: process.platform === 'darwin' ? height : 768,
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    webPreferences: {
      partition: 'persist:user-partition',
      sandbox: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'titleBarPreload.js')
        : path.join(__dirname, '../../.erb/dll/titleBar.preload.js'),
    },
  });

  mainWindow.setMenu(null);

  await mainWindow.loadURL(resolveHtmlPath('titleBar.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('focus', () => {
    if (selectedView) selectedView.webContents.focus();
  });

  mainWindow.webContents.executeJavaScript(
    `localStorage.setItem("machineId", "${machineId}"); localStorage.setItem("appVersion", "${app.getVersion()}"); localStorage.setItem("appIsPackaged", "${
      app.isPackaged
    }");`,
    true
  );

  event('open_app');
};
