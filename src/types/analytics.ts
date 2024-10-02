export type EventParams =
  | { [key: string]: string | number | boolean }
  | undefined;

export type Event = (eventName: string, params?: EventParams) => void;

export type Page = (pageName: string, params?: EventParams) => void;

export interface UserData {
  userId: string;
  appVersion: string;
  userIp: string;
  os: string;
  firstSeen: string;
  lastSeen: string;
  numberOfSessions: number;
  consent: boolean;
}
