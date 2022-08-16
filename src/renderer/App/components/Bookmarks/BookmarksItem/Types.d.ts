import { Bookmark } from "types/bookmarks";

export interface BookmarksItemProps {
  bookmark: Bookmark;
  handleDelete: (id: number) => void;
  handleClick: (url: string) => void;
  replaceItem: (bookmark: Bookmark) => void;
}

