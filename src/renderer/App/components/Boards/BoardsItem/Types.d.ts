import { Board } from "types/boards";

export interface BoardsItemProps {
  bookmark: Bookmark;
  handleDelete: (id: number) => void;
  handleClick: (url: string) => void;
  replaceItem: (bookmark: Bookmark) => void;
}

