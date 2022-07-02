/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import { useCallback } from 'react';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { setActiveBrowser } from 'renderer/App/store/reducers/Board';
import { useBoard } from './useBoard';

export const bringBrowserToTheFront = (
  document: Document,
  browser: HTMLElement | null
) => {
  const browsers = document.querySelectorAll('.Browser__draggable-container');

  browsers.forEach((w: Element) => {
    const z = w as HTMLElement;
    if (z) z.style.zIndex = '1';
  });

  if (browser) browser.style.zIndex = '2';
};

export const scrollToBrowser = (
  document: Document,
  browserId: string
): void => {
  document.querySelector(`#Browser__${browserId}`)?.scrollIntoView();
  window.scrollBy(0, -100);

  bringBrowserToTheFront(
    document,
    document.querySelector(`#Browser__${browserId}`)
  );
};

export const focusUrlBar = (document: Document, browserId: string) => {
  const browser = document.querySelector(`#Browser__${browserId}`);
  const urlBar = browser
    ?.querySelector('.BrowserControlBar__container')
    ?.querySelector('input');
  urlBar?.select();
};

export const useBrowserMethods = () => {
  const dispatch = useAppDispatch();
  const boardState = useBoard();

  const focus = useCallback(
    (document: Document, browserId: string) => {
      scrollToBrowser(document, browserId);
      dispatch(setActiveBrowser(browserId));
      window.app.analytics.event('switch_browser');
    },
    [dispatch]
  );

  const next = useCallback(() => {
    const pos = boardState.browsers.findIndex(
      (b) => b.id === boardState.activeBrowser
    );
    const focusPos = pos === boardState.browsers.length - 1 ? 0 : pos + 1;
    const focusId = boardState.browsers[focusPos].id;
    return focusId;
  }, [boardState.activeBrowser, boardState.browsers]);

  const disablePointerEventsForAll = () => {
    const containers = document.querySelectorAll('.Browser__webview-container');
    containers.forEach((c) => {
      // @ts-ignore
      c.style['pointer-events'] = 'none';
    });
  };

  const enablePointerEventsForAll = () => {
    const containers = document.querySelectorAll('.Browser__webview-container');
    containers.forEach((c) => {
      // @ts-ignore
      c.style['pointer-events'] = 'auto';
    });
  };

  return {
    focus,
    next,
    disablePointerEventsForAll,
    enablePointerEventsForAll,
    scrollToBrowser,
    bringBrowserToTheFront,
    focusUrlBar,
  };
};
