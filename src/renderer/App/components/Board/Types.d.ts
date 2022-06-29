import { BrowserProps } from '../Browser/Types';

export interface BoardType {
  id: string;
  label: string;
  browsers: BrowserProps[];
  activeBrowser?: string | null;
  closedUrls: string[];
  isFullSize: boolean;
}
