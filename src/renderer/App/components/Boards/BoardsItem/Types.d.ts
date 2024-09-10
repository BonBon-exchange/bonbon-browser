import { Board } from "types/boards";

export interface BoardsItemProps {
  board: Board;
  handleDelete: (id: string) => void;
  handleClick: (url: string) => void;
}

