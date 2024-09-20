// types/ipc.ts

import { Board } from './boards';
import { Bookmark, Provider, Tag } from './bookmarks';
import { Download } from './downloads';
import { Extension } from './extensions';
import { Locale } from './i18n';
import { DomainSuggestion } from './suggestions';

// Basic Types
export type Position = {
  x: number;
  y: number;
};

export type IpcInspectElement = Position;

// Analytics Types
export type IpcAnalyticsEvent = {
  eventName: string;
  params?: Record<string, string | number | boolean>;
};

export type IpcAnalyticsPage = {
  pageName: string;
  params?: Record<string, string | number | boolean>;
};

// Board Management Types
export type IpcTabSelect = {
  tabId: string;
  newSession?: boolean;
  isSavedBoard?: boolean;
  board?: Board;
};

export type IpcTabPurge = {
  tabId: string;
};

export type IpcSaveTab = {
  tabId: string;
};

export type IpcRenameTab = {
  tabId: string;
  label: string;
};

export type IpcSetWindowsCount = {
  boardId: string;
  count: number;
};

// Store Management Types
export type StoreValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | StoreValue[];

export type IpcSetStoreValue = {
  key: string;
  value: StoreValue;
};

// History Management Types
export type IpcAddHistory = {
  url: string;
  title: string;
};

// Bookmark Management Types
export type IpcAddBookmark = {
  url: string;
  name: string;
};

// Certificate Error Types
export type IpcCertificateErrorAnswer = {
  isTrusted: boolean;
  webContentsId: number;
  fingerprint: string;
};

// Download Management Types
export type IpcAddDownload = {
  savePath: string;
  startTime: number;
  filename: string;
};

// Context Menu Types
export type IpcShowTabContextMenu = Position;
export type IpcShowLeftbarContextMenu = Position;
export type IpcShowBoardContextMenu = Position;

// Specific IPC Event Types
export type IpcNewWindow = {
  url: string;
};

export type IpcLoadBoard = {
  board: Board;
};

export type IpcLoadSavedBoardCallback = {
  board: Board;
};

export type IpcPurge = undefined;

export type IpcRenameBoard = {
  label: string;
};

export type IpcSaveBoard = {
  board: Board;
};

export type IpcCloseWebview = Position;

export type IpcCloseAllWebview = undefined;

export type IpcCloseOthersWebview = Position;

export type IpcShowAppMenu = undefined; // Define specific properties if needed

export type IpcCertificateError = {
  webContentsId: number;
  fingerprint: string;
};

export type IpcDownloading = Download;

export type IpcShowDownloadsPreview = undefined; // Define specific properties if needed

export type IpcDistributeWindowsEvenly = undefined;

export type IpcSetDefaultWindowSize = {
  webContentsId: number;
};

export type IpcPinWebview = Position;

export type IpcResetBoard = undefined;

// Union Type for IPC Events
export type IpcEvents =
  | { channel: 'new-window'; args: IpcNewWindow }
  | { channel: 'load-board'; args: IpcLoadBoard }
  | { channel: 'load-saved-board-callback'; args: IpcLoadSavedBoardCallback }
  | { channel: 'purge'; args: IpcPurge }
  | { channel: 'rename-board'; args: IpcRenameBoard }
  | { channel: 'save-board'; args: IpcSaveBoard }
  | { channel: 'close-webview'; args: IpcCloseWebview }
  | { channel: 'close-all-webview'; args: IpcCloseAllWebview }
  | { channel: 'close-others-webview'; args: IpcCloseOthersWebview }
  | { channel: 'show-app-menu'; args: IpcShowAppMenu }
  | { channel: 'certificate-error'; args: IpcCertificateError }
  | { channel: 'downloading'; args: IpcDownloading }
  | { channel: 'show-downloads-preview'; args: IpcShowDownloadsPreview }
  | { channel: 'distribute-windows-evenly'; args: IpcDistributeWindowsEvenly }
  | { channel: 'set-default-window-size'; args: IpcSetDefaultWindowSize }
  | { channel: 'pin-webview'; args: IpcPinWebview }
  | { channel: 'reset-board'; args: IpcResetBoard };
