export interface BrowserTopBarProps {
  closeBrowser: () => void;
  minimizeBrowser: () => void;
  toggleFullsizeBrowser: () => void;
  onClick: () => void;
  title?: string;
  favicon?: string;
  isLoading: boolean;
}
