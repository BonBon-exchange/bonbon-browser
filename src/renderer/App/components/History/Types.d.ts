export interface HistoryProps {
  handleClose: () => void;
}

export type HistoryType = {
  id: number;
  url: string;
  title: string;
  date: string;
}
