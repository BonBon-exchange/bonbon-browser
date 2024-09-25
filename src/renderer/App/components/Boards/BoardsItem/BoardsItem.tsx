/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import clsx from 'clsx';

import { BoardsItemProps } from './Types';

export const BoardsItem = ({
  board,
  handleDelete,
  handleClick,
}: BoardsItemProps) => {
  return (
    <div
      key={board.id}
      className={clsx(
        'bg-background-primary p-5 rounded-sm shadow-sm mb-7 cursor-pointer flex flex-row overflow-hidden transition border',
        'hover:border-border'
      )}
    >
      <div
        className="flex-grow overflow-hidden"
        onClick={() => handleClick(board.id)}
      >
        <div className="font-bold">{board.label}</div>
        {/* If you have tags or URLs, include them here with appropriate Tailwind classes */}
      </div>
      <div className="flex flex-row">
        <div
          className="p-2 hover:text-icon-primary transition-colors"
          onClick={() => handleDelete(board.id)}
        >
          <DeleteForeverIcon />
        </div>
      </div>
    </div>
  );
};
