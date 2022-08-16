export type EventParams =
  | { [key: string]: string | number | boolean }
  | undefined;

export type Event = (eventName: string, params?: EventParams) => void;
