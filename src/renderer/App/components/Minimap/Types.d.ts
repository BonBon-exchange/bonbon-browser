export type MiniWindow = {
  left: number;
  top: number;
  width: number;
  height: number;
  favicon: string | undefined;
  id: string;
  isLoading: boolean;
  capture?: string;
}

export type MiniView = {
  top: number;
  height: number;
}

export interface MinimapProps {
  handleHide: () => void;
}
