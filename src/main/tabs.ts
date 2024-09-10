/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import { BrowserView } from 'electron';

import { Board } from 'types/boards';
import { IpcRenameTab, IpcSaveTab, IpcTabPurge, IpcTabSelect } from 'types/ipc';
import {
  createBrowserView,
  getMainWindow,
  getSelectedView,
  setSelectedView,
} from './browser';

import { getViews, setViews } from './ipcMainEvents';
import db from './db';


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
  const views = getViews();
  const view = views[args.tabId] as any;
  if (view) {
    view.webContents.send('save-board', args);
  }
};

export const renameTab = (args: IpcRenameTab) => {
  const views = getViews();
  const view = views[args.tabId];
  if (view) view.webContents.send('rename-board', { label: args.label });
};

export const saveBoardCallback = async (board: Board) => {
  console.log(board)
  return new Promise((resolve, reject) => {

    db.run(
      'INSERT INTO boards (boardId, content) VALUES (?, ?)',
      board.id,
      JSON.stringify(board),
      () => {
        db.all(
          'SELECT id, content FROM boards WHERE id = ? ORDER BY id DESC LIMIT 1',
          board.id,
          (err: any, rows: { id: number; content: string }[]) => {
            if (err) {
              reject(
                new Error(
                  `Error when saving board while selecting Id.`
                )
              );
            } else {
              resolve({
                id: Number(rows[0].id),
                content: JSON.parse(rows[0].content),
              });
            }
          }
        );
      }
    );
  });
}
