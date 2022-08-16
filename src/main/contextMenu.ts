/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import { IpcMainEvent, BrowserWindow, Menu } from 'electron';
import {
  IpcShowBoardContextMenu,
  IpcShowLeftbarContextMenu,
  IpcShowTabContextMenu,
} from 'types/ipc';

import { getMainWindow, getSelectedView } from './browser';
import i18n from './i18n';

export const showTabContextMenu = (
  e: IpcMainEvent,
  params: IpcShowTabContextMenu
) => {
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
};

export const showLeftbarContextMenu = (
  e: IpcMainEvent,
  params: IpcShowLeftbarContextMenu
) => {
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
};

export const showBoardContextMenu = (
  e: IpcMainEvent,
  params: IpcShowBoardContextMenu
) => {
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
};
