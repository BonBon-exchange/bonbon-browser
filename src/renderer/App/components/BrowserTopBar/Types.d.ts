export interface BrowserTopBarProps {
  closeBrowser: () => void;
  minimizeBrowser: () => void;
  toggleFullSizeBrowser: () => void;
  onClick: () => void;
  title?: string;
  favicon?: string;
  isLoading: boolean;
  isMaximized: boolean;
}
