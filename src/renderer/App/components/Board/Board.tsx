/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';

import { Browser } from 'renderer/App/components/Browser';
import { BrowserProps } from 'renderer/App/components/Browser/Types';
import { useBoard } from 'renderer/App/hooks/useBoard';
import { useBrowserMethods } from 'renderer/App/hooks/useBrowserMethods';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { setActiveBrowser } from 'renderer/App/store/reducers/Board';

import { BoardProps } from './Types';

import './style.scss';

export const Board: React.FC<BoardProps> = ({ isFullSize }) => {
  const board = useBoard();
  const dispatch = useAppDispatch();
  const { focus } = useBrowserMethods();
  const [items, setItems] = useState<BrowserProps[]>([]);
  const [maxHeight, setMaxHeight] = useState<number>(3000);
  const helpers = useStoreHelpers();

  const makeBrowsers = useCallback((sorted: BrowserProps[]) => {
    return sorted.map((b) => <Browser {...b} key={b.id} firstRendering />);
  }, []);

  const contextMenuListener = (e: MouseEvent) => {
    e.preventDefault();
    window.app.tools.showBoardContextMenu({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!board.isFullSize) {
      setTimeout(
        () => helpers.board.distributeWindowsByOrder(board.browsers),
        100
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board.isFullSize]);

  useEffect(() => {
    const toSort = [...board.browsers];
    const sorted = toSort.sort((a, b) => {
      return a.id > b.id ? 1 : -1;
    });
    setItems(sorted);

    const max = board.browsers.reduce(
      (acc, val) => Math.max(acc, val.top + val.height + 100),
      0
    );
    setMaxHeight(max);
  }, [board.browsers]);

  useEffect(() => {
    window.app.board.setWindowsCount({
      boardId: board.id,
      count: board.browsers.length,
    });
  }, [board.browsers.length, board.id]);

  useEffect(() => {
    if (board.activeBrowser) {
      focus(board.activeBrowser, true);
      dispatch(setActiveBrowser(board.activeBrowser));
    }
  }, [board.activeBrowser, focus, dispatch]);

  // focus activeBrowser when componentDidMount
  useEffect(() => {
    setTimeout(() => {
      if (board.activeBrowser) focus(board.activeBrowser);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // @ts-ignore
    document.querySelector('#Board__container').style.height = `${
      Number(maxHeight) + 100
    }px`;
  }, [maxHeight]);

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
      <div className="Board__edge-snap-maximized" />
    </div>
  );
};
