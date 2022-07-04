import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('app', {
  analytics: {
    event: (eventName: string, params: Record<string, string>) => {
      ipcRenderer.send('analytics', { eventName, params });
    },
  },
  tools: {
    inspectElement: (point: { x: number; y: number }) => {
      ipcRenderer.send('inspectElement', point);
    },
    toggleDarkMode: () => {
      ipcRenderer.invoke('dark-mode:toggle');
    },
  },
  board: {
    open: (board: { id: string; label: string; isFullSize: boolean }) => {
      ipcRenderer.send('open-board', board);
    },
    close: () => {
      ipcRenderer.send('close-active-board');
    },
    selectNext: () => {
      ipcRenderer.send('select-next-board');
    },
    setWindowsCount: (args: { boardId: string; count: number }) => {
      ipcRenderer.send('set-windows-count', args);
    },
  },
  browser: {
    select: (webContentsId: string) => {
      ipcRenderer.send('select-browser', webContentsId);
    },
    selectBrowserView: () => {
      ipcRenderer.send('select-browserView');
    },
  },
  listener: {
    newWindow: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('new-window', action);
    },
    loadBoard: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('load-board', action);
    },
    purge: (action: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
      ipcRenderer.on('purge', action);
    },
    renameBoard: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('rename-board', action);
    },
    closeWebview: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('close-webview', action);
    },
    closeAllWebview: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('close-all-webview', action);
    },
    closeOthersWebview: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('close-others-webview', action);
    },
    showAppMenu: (
      action: (event: IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('show-app-menu', action);
    },
  },
  off: {
    newWindow: () => {
      ipcRenderer.removeAllListeners('new-window');
    },
    loadBoard: () => {
      ipcRenderer.removeAllListeners('load-board');
    },
    purge: () => {
      ipcRenderer.removeAllListeners('purge');
    },
    renameBoard: () => {
      ipcRenderer.removeAllListeners('rename-board');
    },
    closeWebview: () => {
      ipcRenderer.removeAllListeners('close-webview');
    },
    closeAllWebview: () => {
      ipcRenderer.removeAllListeners('close-all-webview');
    },
    closeOthersWebview: () => {
      ipcRenderer.removeAllListeners('close-others-webview');
    },
    showAppMenu: () => {
      ipcRenderer.removeAllListeners('show-app-menu');
    },
  },
});
