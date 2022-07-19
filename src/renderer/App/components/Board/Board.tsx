/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useCallback, useState } from 'react';
import clsx from 'clsx';

import { Browser } from 'renderer/App/components/Browser';
import { useBoard } from 'renderer/App/hooks/useBoard';
import { useBrowserMethods } from 'renderer/App/hooks/useBrowserMethods';
import { AnimatePresence } from 'framer-motion';

import { BrowserProps } from 'renderer/App/components/Browser/Types';

import { BoardProps } from './Types';

import './style.scss';

export const Board: React.FC<BoardProps> = ({ isFullSize }) => {
  const board = useBoard();
  const { focus } = useBrowserMethods();
  const [items, setItems] = useState<BrowserProps[]>([]);

  const makeBrowsers = useCallback((sorted: BrowserProps[]) => {
    return sorted.map((b) => <Browser {...b} key={b.id} firstRendering />);
  }, []);

  const contextMenuListener = (e: MouseEvent) => {
    e.preventDefault();
    window.app.app.showBoardContextMenu({ x: e.clientX, y: e.clientY });
  };

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

  useEffect(() => {
    if (board.activeBrowser) focus(board.activeBrowser);
  }, [board.activeBrowser, focus]);

  useEffect(() => {
    document
      .getElementById('Board__container')
      ?.addEventListener('contextmenu', contextMenuListener);

    return () =>
      document
        .getElementById('Board__container')
        ?.removeEventListener('contextmenu', contextMenuListener);
  }, []);

  return (
    <div
      id="Board__container"
      className={clsx({
        'Board__is-maximized': board.isFullSize || isFullSize,
        'Board__isnt-maximized': !board.isFullSize && !isFullSize,
      })}
    >
      <AnimatePresence>{makeBrowsers(items)}</AnimatePresence>
      <div className="Board__edge-snap-left" />
      <div className="Board__edge-snap-right" />
    </div>
  );
};
