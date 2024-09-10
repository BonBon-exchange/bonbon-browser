/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { BoardsItemProps } from './Types';

export const BoardsItem = ({
  board,
  handleDelete,
  handleClick,
}: BoardsItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(board.label);

  const handleEditBoard = () => setIsEditing(true);
  const handleSaveBoard = () => {
    // const formattedBoard = {
    //   id: board.id,
    //   name,
    //   host: board.host,
    //   domain: board.domain,
    //   tags: tags.map((tg) => (tg.inputValue ? tg.inputValue : tg.tag)),
    // };

    // window.app.board
    //   .editBoard(formattedBoard)
    //   .then((b) => {
    //     setIsEditing(false);
    //     replaceItem(b);
    //   })
    //   .catch(console.log);
  };

  // const filter = createFilterOptions<Tag>();

  useEffect(() => {
    // window.app.board
    //   .getBoardTags()
    //   .then((val) => {
    //     setTagsOptions(val);
    //   })
    //   .catch(console.log);
  }, []);

  return isEditing ? (
    <div className="Boards__item" key={board.id}>
      <div className="Boards__item-text">
        <div className="Boards__item-name">
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </div>
      </div>
      <div className="Boards__item-controls">
        <div
          className="Boards__item-control"
          onClick={() => handleSaveBoard()}
        >
          <DoneIcon />
        </div>
        <div
          className="Boards__item-control"
          onClick={() => setIsEditing(false)}
        >
          <CloseIcon />
        </div>
      </div>
    </div>
  ) : (
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
          onClick={() => handleEditBoard()}
        >
          <EditIcon />
        </div>
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
