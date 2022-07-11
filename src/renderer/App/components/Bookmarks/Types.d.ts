export interface BookmarksProps {
  handleClose: () => void;
}

export type BookmarkType = {
  id: number;
  url: string;
  name: string;
}
