/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable import/prefer-default-export */
import { useCallback } from 'react';
import { v4 } from 'uuid';

import { useAppDispatch } from 'renderer/App/store/hooks';

import {
  addBrowser,
  setBoard,
  removeBrowser,
  minimizeBrowser,
  unminimizeBrowser,
  removeLastCloseUrl,
  toggleSearch,
  updateBrowser,
} from 'renderer/App/store/reducers/Board';
import { getCoordinateWithNoCollision } from 'renderer/App/helpers/d2';
import { useBoard } from './useBoard';
import { useBrowserMethods } from './useBrowserMethods';

export const useStoreHelpers = (helpersParams?: { boardId?: string }) => {
  const dispatch = useAppDispatch();
  const board = useBoard();
  const { scrollToBrowser, focusUrlBar } = useBrowserMethods();

  const makeBrowser = useCallback(
    async (params: { url?: string; top?: number; left?: number }) => {
      const browserId = v4();
      const defaultWebpage = (await window.app.config.get(
        'browsing.defaultWebpage'
      )) as string;
      const defaultSize = (await window.app.config.get(
        'browsing.size'
      )) as string;
      const defaultWidth = (await window.app.config.get(
        'browsing.width'
      )) as number;
      const defaultHeight = (await window.app.config.get(
        'browsing.height'
      )) as number;
      const width =
        defaultSize === 'lastClosed' && board.lastClosedBrowserDimensions
          ? board.lastClosedBrowserDimensions[0]
          : defaultWidth;
      const height =
        defaultSize === 'lastClosed' && board.lastClosedBrowserDimensions
          ? board.lastClosedBrowserDimensions[1]
          : defaultHeight;
      const { x, y } = getCoordinateWithNoCollision(
        document,
        board,
        defaultHeight,
        defaultWidth
      );
      const newBrowser = {
        id: browserId,
        url: params.url || defaultWebpage,
        top: params.top || y,
        left: params.left || x,
        height,
        width,
        firstRendering: true,
        isLoading: true,
        isMinimized: false,
      };
      return newBrowser;
    },
    [board]
  );

  const makeAndAddBrowser = useCallback(
    async (params: { url?: string }): Promise<void> => {
      if (board) {
        const newBrowser = await makeBrowser(params);
        dispatch(addBrowser(newBrowser));
        setTimeout(() => {
          scrollToBrowser(newBrowser.id);
          focusUrlBar(newBrowser.id);
        }, 300);
      }
    },
    [board, dispatch, makeBrowser, scrollToBrowser, focusUrlBar]
  );

  const createBoard = useCallback(
    async (params: { id?: string }) => {
      const newBrowser = await makeBrowser({ top: 120, left: 120 });
      const id = params.id || v4();
      const newBoard = {
        id,
        label: `New board`,
        browsers: [newBrowser],
        closedUrls: [],
        isFullSize: false,
      };

      dispatch(setBoard(newBoard));
      window.app.analytics.event('add_board');
    },
    [dispatch, makeBrowser]
  );

  const loadBoard = useCallback(
    (params: { id: string }) => {
      window.app.analytics.event('load_board');
      if (board.id === helpersParams?.boardId) return;
      createBoard(params);
    },
    [createBoard, board.id, helpersParams?.boardId]
  );

  const closeBrowser = useCallback(
    (browserId: string) => {
      dispatch(removeBrowser(browserId));
    },
    [dispatch]
  );

  const minBrowser = useCallback(
    (browserId: string) => {
      dispatch(minimizeBrowser(browserId));
    },
    [dispatch]
  );

  const showBrowser = useCallback(
    (browserId: string) => {
      dispatch(unminimizeBrowser(browserId));
    },
    [dispatch]
  );

  const closeBoard = useCallback(() => {
    window.app.board.close();
  }, []);

  const reopenLastClosed = useCallback(() => {
    if (board.closedUrls.length > 0) {
      makeAndAddBrowser({ url: board.closedUrls[board.closedUrls.length - 1] });
      dispatch(removeLastCloseUrl());
    }
  }, [board.closedUrls, dispatch, makeAndAddBrowser]);

  const togSearch = useCallback(
    (browserId: string) => {
      dispatch(toggleSearch(browserId));
    },
    [dispatch]
  );

  const distributeWindowsEvenly = useCallback(() => {
    const containers = document.querySelectorAll(
      '.Browser__draggable-container'
    );

    const sortedContainer = Array.from(containers).sort((a, b) => {
      const browserA = board.browsers.find(
        (brow) => brow.id === a.getAttribute('data-id')
      );
      const browserB = board.browsers.find(
        (brow) => brow.id === b.getAttribute('data-id')
      );

      if (browserA && browserB) {
        if (browserA.top - browserB.top > 1) return 1;
        if (browserA.top === browserB.top && browserA.left - browserB.left > 1)
          return 1;
      }

      return -1;
    });

    const maxWidth = document.querySelector('#Board__container')?.clientWidth;
    let sumWidth = 0;
    let index = -1;
    const maxIndex = containers.length - 1;
    let rowContainers;
    let container;
    const yMargin = 50;
    let currentY = yMargin;
    let xMargin: number;
    let biggestHeight;
    let currentX: number;
    let id;
    if (maxWidth) {
      while (index < maxIndex) {
        rowContainers = [];
        sumWidth = 0;
        biggestHeight = 0;
        while (sumWidth <= maxWidth && index < maxIndex) {
          index++;
          container = sortedContainer[index];
          sumWidth += container.clientWidth;
          if (container.clientHeight > biggestHeight)
            biggestHeight = container.clientHeight;
          if (sumWidth < maxWidth) rowContainers.push(container);
          else index--;
        }

        let rcSumWidth = 0;
        rowContainers.forEach((c) => {
          rcSumWidth += c.clientWidth;
        });

        xMargin = Number(
          ((maxWidth - rcSumWidth) / (rowContainers.length + 1)).toFixed(0)
        );

        // process here
        currentX = xMargin;
        rowContainers.forEach((c) => {
          id = c.getAttribute('data-id');
          if (id) {
            dispatch(
              updateBrowser({
                browserId: id,
                params: {
                  left: currentX,
                  top: currentY,
                },
              })
            );
          }
          currentX += c.clientWidth + xMargin;
        });

        // end
        currentY += yMargin + biggestHeight;
      }
    }
  }, [dispatch, board.browsers]);

  return {
    browser: {
      add: makeAndAddBrowser,
      close: closeBrowser,
      reopenLastClosed,
      minimize: minBrowser,
      show: showBrowser,
      toggleSearch: togSearch,
    },
    board: {
      create: createBoard,
      load: loadBoard,
      close: closeBoard,
      distributeWindowsEvenly,
    },
  };
};
