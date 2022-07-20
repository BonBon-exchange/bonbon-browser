/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { injectBrowserAction } from 'electron-chrome-extensions-production/dist/browser-action';

injectBrowserAction();

contextBridge.exposeInMainWorld('titleBar', {
  app: {
    close: () => {
      ipcRenderer.send('close-app');
    },
    minimize: () => {
      ipcRenderer.send('minimize-app');
    },
    maximize: () => {
      ipcRenderer.send('maximize-app');
    },
    showMenu: () => {
      ipcRenderer.send('show-app-menu');
    },
    showDownloadsPreview: () => {
      ipcRenderer.send('show-downloads-preview');
    },
    showTabContextMenu: (params: { x: number; y: number }) => {
      ipcRenderer.send('show-tab-context-menu', params);
    },
  },
  analytics: {
    event: (eventName: string, params: Record<string, string>) => {
      ipcRenderer.send('analytics', { eventName, params });
    },
  },
  tools: {
    inspectElement: (point: { x: number; y: number }) => {
      ipcRenderer.send('inspectElement', point);
    },
  },
  tabs: {
    select: (tabId: string) => {
      ipcRenderer.send('tab-select', { tabId });
    },
    purge: (tabId: string) => {
      ipcRenderer.send('tab-purge', { tabId });
    },
    save: (tabId: string) => {
      ipcRenderer.send('save-tab', { tabId });
    },
    rename: ({ tabId, label }: { tabId: string; label: string }) => {
      ipcRenderer.send('rename-tab', { tabId, label });
    },
  },
  listener: {
    openTab: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('open-tab', action);
    },
    renameTab: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('rename-tab', action);
    },
    closeTab: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('close-tab', action);
    },
    saveBoard: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('save-board', action);
    },
    closeActiveTab: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('close-active-tab', action);
    },
    selectNextBoard: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('select-next-board', action);
    },
    setWindowsCount: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('set-windows-count', action);
    },
    closeAllTab: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('close-all-tab', action);
    },
    closeOthersTab: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('close-others-tab', action);
    },
    downloadState: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('download-state', action);
    },
    removeExtension: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('remove-extension', action);
    },
  },
  off: {
    openTab: () => {
      ipcRenderer.removeAllListeners('open-tab');
    },
    renameTab: () => {
      ipcRenderer.removeAllListeners('rename-tab');
    },
    closeTab: () => {
      ipcRenderer.removeAllListeners('close-tab');
    },
    saveBoard: () => {
      ipcRenderer.removeAllListeners('save-board');
    },
    closeActiveTab: () => {
      ipcRenderer.removeAllListeners('close-active-tab');
    },
    selectNextBoard: () => {
      ipcRenderer.removeAllListeners('select-next-board');
    },
    setWindowsCount: () => {
      ipcRenderer.removeAllListeners('set-windows-count');
    },
    closeAllTab: () => {
      ipcRenderer.removeAllListeners('close-all-tab');
    },
    closeOthersTab: () => {
      ipcRenderer.removeAllListeners('close-others-tab');
    },
    downloadState: () => {
      ipcRenderer.removeAllListeners('download-state');
    },
    removeExtension: () => {
      ipcRenderer.removeAllListeners('remove-extension');
    },
  },
  screens: {
    library: () => {
      ipcRenderer.send('show-library');
    },
    settings: () => {
      ipcRenderer.send('show-settings');
    },
  },
  os: {
    getPlatform: () => process.platform,
  },
});
