/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import { BrowserView } from 'electron';
import { IpcRenameTab, IpcSaveTab, IpcTabPurge, IpcTabSelect } from 'types/ipc';
import {
  createBrowserView,
  getMainWindow,
  getSelectedView,
  setSelectedView,
} from './browser';

import { getViews, setViews } from './ipcMainEvents';

export const selectTab = (args: IpcTabSelect) => {
  const views = getViews();
  const viewToShow: BrowserView = views[args.tabId]
    ? views[args.tabId]
    : createBrowserView({newSession: args.newSession });
  views[args.tabId] = viewToShow;
  setViews(views);
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
};

export const purgeTab = (args: IpcTabPurge) => {
  const views = getViews();
  const view = views[args.tabId] as any;
  if (view) {
    view.webContents.send('purge');
    getMainWindow()?.removeBrowserView(view);
    view.webContents.destroy();
  }
  delete views[args.tabId];
  setViews(views);
};

export const saveTab = (args: IpcSaveTab) => {
  // save in mongodb
};

export const renameTab = (args: IpcRenameTab) => {
  const views = getViews();
  const view = views[args.tabId];
  if (view) view.webContents.send('rename-board', { label: args.label });
};
