/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-unstable-nested-components */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import AutoSize from 'react-virtualized-auto-sizer';

import { CloseButton } from 'renderer/App/components/CloseButton';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { Loader } from 'renderer/App/components/Loader';
import { Board as BoardType } from 'types/boards';
import { BoardsItem } from './BoardsItem';

import { BoardsProps } from './Types';

import './style.scss';

/* eslint-disable react/prop-types */
export const Boards = ({ handleClose }: BoardsProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [showImport, setShowImport] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<BoardType[]>([]);
  const [filteredItems, setFilteredItems] = useState<BoardType[]>([]);
  const { browser } = useStoreHelpers();

  const replaceItem = (board: BoardType) => {
    const newItems = [...items];
    const index = newItems.findIndex((i) => i.id === board.id);
    if (index > -1) newItems[index] = board;
    setItems(newItems);
  };

  const handleDeleteBoard = (id: number) => {
    const url = items.find((i) => i.id === id)?.url;
    if (url) {
      window.app.board
        .removeBoard(url)
        .then(() => {
          const newItems = [...items];
          const index = newItems.findIndex((i) => i.id === id);
          if (index > -1) newItems.splice(index, 1);
          setItems(newItems);
        })
        .catch(console.log);
    }
  };

  const handleBoardClick = (url: string) => {
    browser.add({ url });
    handleClose();
  };

  const refreshList = () => {
    window.app.board
      .getAllBoards()
      .then((val) => {
        setItems(val);
        setFilteredItems(val);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const Item = ({
    data,
    index,
    style,
  }: {
    data: BoardType[];
    index: number;
    style: any;
  }) => {
    return (
      <div style={style}>
        <BoardsItem
          key={data[index].id}
          board={data[index]}
          handleClick={handleBoardClick}
          handleDelete={handleDeleteBoard}
          replaceItem={replaceItem}
        />
      </div>
    );
  };

  useEffect(() => {
    const filtered = items?.filter(
      (i) =>
        i.url.toLowerCase().includes(search.toLowerCase()) ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        !i.tags?.every(
          (tag) => !tag.toLocaleLowerCase().includes(search.toLowerCase())
        )
    );
    setFilteredItems(filtered);
  }, [search, items]);

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <div id="Boards__container">
        <CloseButton handleClose={handleClose} />
        <div id="Boards__centered-container">
          <h2>{t('Boards')}</h2>
          <input
            type="text"
            className="Boards__search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search')}
          />
          {isLoading ? (
            <Loader />
          ) : (
            <AutoSize>
              {({ height }: { height: number }) => (
                <List
                  height={height - 230}
                  itemCount={filteredItems.length}
                  width={800}
                  itemData={filteredItems}
                  itemSize={150}
                >
                  {Item}
                </List>
              )}
            </AutoSize>
          )}
        </div>
      </div>
  );
};
