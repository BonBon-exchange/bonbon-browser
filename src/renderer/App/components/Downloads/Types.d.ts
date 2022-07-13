export interface DownloadsProps {
  handleClose: () => void;
}

export type DownloadType = {
  id: number;
  savePath: string;
  date: string;
  filename: string;
}
