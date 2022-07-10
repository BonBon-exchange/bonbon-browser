/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useCallback, useState } from 'react';

import { Browser } from 'renderer/App/components/Browser';
import { useBoard } from 'renderer/App/hooks/useBoard';

import { BrowserProps } from 'renderer/App/components/Browser/Types';

import './style.css';

export const Board: React.FC = () => {
  const board = useBoard();
  const [items, setItems] = useState<BrowserProps[]>([]);

  const makeBrowsers = useCallback((sorted: BrowserProps[]) => {
    return sorted.map((b) => <Browser {...b} key={b.id} firstRendering />);
  }, []);

  useEffect(() => {
    const toSort = [...board.browsers];
    const sorted = toSort.sort((a, b) => {
      return a.id > b.id ? 1 : -1;
    });
    setItems(sorted);
  }, [board.browsers]);

  useEffect(() => {
    window.app.board.setWindowsCount({
      boardId: board.id,
      count: board.browsers.length,
    });
  }, [board.browsers.length, board.id]);

  return <div className="Board__container">{makeBrowsers(items)}</div>;
};
