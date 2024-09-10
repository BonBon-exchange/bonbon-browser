/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { BoardsItemProps } from './Types';

export const BoardsItem = ({
  board,
  handleDelete,
  handleClick,
}: BoardsItemProps) => {

  return (
    <div className="Boards__item" key={board.id}>
      <div
        className="Boards__item-text"
        onClick={() => handleClick(board.id)}
      >
        <div className="Boards__item-name">{board.label}</div>
      </div>
      <div className="Boards__item-controls">
        <div
          className="Boards__item-control"
          onClick={() => handleDelete(board.id)}
        >
          <DeleteForeverIcon />
        </div>
      </div>
    </div>
  );
};
