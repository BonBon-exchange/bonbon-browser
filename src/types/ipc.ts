export type IpcInspectElement = {
  x: number;
  y: number;
};

export type IpcAnalytics = {
  eventName: string;
  params?: Record<string, string | number | boolean>;
};

export type IpcTabSelect = {
  tabId: string;
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
