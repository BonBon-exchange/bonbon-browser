import { EventParams } from "types/analytics";
import { Board } from "types/boards";
import { IpcInspectElement, IpcRenameTab, IpcShowTabContextMenu } from "types/ipc";

declare global {
  interface Window {
    titleBar: {
      app: {
        close: () => void;
        minimize: () => void;
        maximize: () => void;
        showMenu: () => void;
        showDownloadsPreview: () => void;
        showTabContextMenu: (params: IpcShowTabContextMenu) => void;
        isMaximized: () => Promise<boolean>;
      };
      analytics: {
        event: (eventName: string, params?: EventParams) => void;
      };
      tools: {
        inspectElement: (point: IpcInspectElement) => void;
      };
      listener: {
        openTab: (action: (_e: IpcRendererEvent, args: { id?: string; label?: string; }) => void) => void;
        closeTab: (action: (_e: IpcRendererEvent, args: { x: number; y: number }) => void) => void;
        renameTab: (action: (_e: IpcRendererEvent, args: { x: number; y: number; }) => void) => void;
        saveBoard: (action: (_e: IpcRendererEvent, args: { x: number; y: number; }) => void) => void;
        closeActiveTab: (action: () => void) => void;
        selectNextBoard: (action: () => void) => void;
        setWindowsCount: (action: (_e: IpcRendererEvent, args: { boardId: string; count: number; }) => void) => void;
        closeAllTab: (action: () => void) => void;
        closeOthersTab: (action: (_e: IpcRendererEvent, args: { x: number; y: number; }) => void) => void;
        downloadState: (action: (_e: IpcRendererEvent, state: DownloadState) => void) => void;
        removeExtension: (action: (_e: IpcRendererEvent, id: string) => void) => void;
        hideDownloadsPreview: (action: () => void) => void;
        appClicked: (action: () => void) => void;
        loadSavedBoard: (action: (_e: IpcRendererEvent, board: Board) => void) => void;
      };
      off: {
        openTab: () => void;
        closeTab: () => void;
        renameTab: () => void;
        saveBoard: () => void;
        closeActiveTab: () => void;
        selectNextBoard: () => void;
        setWindowsCount: () => void;
        closeAllTab: () => void;
        closeOthersTab: () => void;
        downloadState: () => void;
        removeExtension: () => void;
        hideDownloadsPreview: () => void;
        appClicked: () => void;
        loadSavedBoard: () => void;
      };
      tabs: {
        select: ({tabId, newSession, isSavedBoard, board}: {tabId: string, newSession?: boolean, isSavedBoard?: boolean, board?: Board}) => void;
        purge: (tabId: string) => void;
        save: (tabId: string) => void;
        rename: (args: IpcRenameTab) => void;
      };
      screens: {
        library: () => void;
        settings: () => void;
      };
      os: {
        getPlatform: () => string;
      }
    };
  }
}

export {};
