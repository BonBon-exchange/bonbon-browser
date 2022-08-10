import { BrowserProps } from '../Browser/Types';

export interface BoardType {
  id: string;
  label: string;
  browsers: BrowserProps[];
  activeBrowser?: string | null;
  closedUrls: string[];
  isFullSize: boolean;
  lastClosedBrowserDimensions?: [number, number];
  lastResizedBrowserDimensions?: [number, number];
  browsersActivity: string[];
}

export interface BoardProps {
  isFullSize?: boolean;
}
