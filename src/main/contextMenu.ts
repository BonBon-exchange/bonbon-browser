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
      label: i18n.t('Close board'),
      click: () => {
        mainWindow?.webContents.send('close-tab', {
          x: params.x,
          y: params.y,
        });
      },
    },
    {
      label: i18n.t('Close all boards'),
      click: () => {
        mainWindow?.webContents.send('close-all-tab');
      },
    },
    {
      label: i18n.t('Close others boards'),
      click: () => {
        mainWindow?.webContents.send('close-others-tab', {
          x: params.x,
          y: params.y,
        });
      },
    },
    {
      label: i18n.t('Rename board'),
      click: () => {
        mainWindow?.webContents.send('rename-tab', {
          x: params.x,
          y: params.y,
        });
      },
    },
    {
      label: i18n.t('Save board'),
      click: () => {
        mainWindow?.webContents.send('save-board', {
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
      label: i18n.t('Toggle pin window'),
      click: () => {
        selectedView?.webContents.send('pin-webview', {
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
  // eslint-disable-next-line no-undef
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: i18n.t('Distribute windows evenly'),
      click: () => {
        selectedView?.webContents.send('distribute-windows-evenly');
      },
    },
    {
      label: i18n.t('Reset settings'),
      click: () => {
        selectedView?.webContents.send('reset-board');
      },
    },
    {
      label: i18n.t('Autotile'), // Submenu label
      submenu: [
        {
          label: '1x1',
          click: () => {
            selectedView?.webContents.send('autotile-windows', 1, 1);
          },
        },
        {
          label: '1x2',
          click: () => {
            selectedView?.webContents.send('autotile-windows', 1, 2);
          },
        },
        {
          label: '2x1',
          click: () => {
            selectedView?.webContents.send('autotile-windows', 2, 1);
          },
        },
        {
          label: '2x2',
          click: () => {
            selectedView?.webContents.send('autotile-windows', 2, 2);
          },
        },
        {
          label: '3x1',
          click: () => {
            selectedView?.webContents.send('autotile-windows', 3, 1);
          },
        },
        {
          label: '3x2',
          click: () => {
            selectedView?.webContents.send('autotile-windows', 3, 2);
          },
        },
      ],
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

  const menu = Menu.buildFromTemplate(template);
  menu.popup({
    window: BrowserWindow.fromWebContents(e.sender) || undefined,
  });
};
