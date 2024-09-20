// types/configKeys.ts

export interface ConfigKeys {
  'browsing.defaultWebpage': string;
  'browsing.searchEngine': string;
  'browsing.width': number;
  'browsing.height': number;
  'browsing.size': 'lastClosed' | 'lastResized' | 'defined' | 'fit';
  'browsing.topEdge': string;
  'application.backgroundGradientColors': string[];
  'application.minimapTimeout': number;
  'application.minimapOn': boolean;
}
