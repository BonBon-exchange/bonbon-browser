import { BookmarkType } from "renderer/App/components/Bookmarks/Types";

export interface BookmarksItemProps {
  bookmark: BookmarkType;
  handleDelete: (id: number) => void;
  handleClick: (url: string) => void;
  replaceItem: (bookmark: BookmarkType) => void;
}

export type TagOptionType = {
  tag: string;
  inputValue?: string;
}
