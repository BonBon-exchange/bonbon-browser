/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React, { useCallback, useEffect, useState } from 'react';
import { Reorder } from 'framer-motion';

import { useBoard } from 'renderer/App/hooks/useBoard';
import { BrowserProps } from 'renderer/App/components/Browser/Types';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { setBrowsers } from 'renderer/App/store/reducers/Board';
import { ButtonAddBrowser } from 'renderer/App/components/ButtonAddBrowser';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { LeftBarItem } from './LeftBarItem';

import './style.scss';

export const LeftBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const boardState = useBoard();
  const [items, setItems] = useState<BrowserProps[]>(boardState.browsers);
  const { browser, board } = useStoreHelpers();

  const handleReorder = (newOrder: BrowserProps[]) => {
    setItems(newOrder);
    dispatch(setBrowsers(newOrder));
    board.distributeWindowsByOrder(newOrder);
  };

  const handleAddBrowser = () => {
    browser.add({}).catch(console.log);
  };

  const makeItem = useCallback((b: BrowserProps) => {
    return <LeftBarItem {...b} />;
  }, []);

  const makeFavicons = useCallback(() => {
    return items.map((b: BrowserProps) => makeItem(b));
  }, [items, makeItem]);

  useEffect(() => {
    if (boardState.isFullSize) {
      setItems(boardState.browsers);
    }
  }, [boardState.isFullSize, boardState.browsers]);

  useEffect(() => {
    if (!boardState.isFullSize) {
      setItems(board.getSortedBrowsers);
    }
  }, [board.getSortedBrowsers, boardState.isFullSize]);

  return (
    <div id="LeftBar__browserFavContainer">
      <Reorder.Group values={items} onReorder={handleReorder} axis="y">
        <div id="LeftBar__browserFavContainerItems">{makeFavicons()}</div>
        <ButtonAddBrowser onClick={handleAddBrowser} />
      </Reorder.Group>
    </div>
  );
};
