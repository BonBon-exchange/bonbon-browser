/* eslint-disable promise/always-return */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import {
  PageFaviconUpdatedEvent,
  PageTitleUpdatedEvent,
  IpcMessageEvent,
  LoadCommitEvent,
} from 'electron';
import { useCallback, useEffect } from 'react';

import { useAppDispatch } from 'renderer/App/store/hooks';
import {
  updateBrowserUrl,
  updateBrowserFav,
  updateBrowserTitle,
  setActiveBrowser,
  updateBrowser,
  updateBrowserLoading,
} from 'renderer/App/store/reducers/Board';
import {
  getContainerFromBrowserId,
  getWebviewFromBrowserId,
} from 'renderer/App/helpers/dom';
import { useBrowserMethods } from './useBrowserMethods';
import { useStoreHelpers } from './useStoreHelpers';
import { useBoard } from './useBoard';

export const useBrowserEvents = (
  browserId: string,
  manualWebview?: Electron.WebviewTag | null
) => {
  const { bringBrowserToTheFront } = useBrowserMethods();
  const container = getContainerFromBrowserId(browserId);
  const webview = manualWebview || getWebviewFromBrowserId(browserId);
  const helpers = useStoreHelpers();
  const board = useBoard();
  const dispatch = useAppDispatch();

  const browser = board.browsers.find((b) => b.id === browserId);

  const ipcMessageListener = useCallback(
    (e: Event & { args: any }) => {
      const event = e as IpcMessageEvent;
      switch (event.channel) {
        default:
          break;

        case 'AltDown':
          const altDownEvent = new KeyboardEvent('keydown', { key: 'Alt' });
          window.dispatchEvent(altDownEvent);
          break;

        case 'AltUp':
          const altUpEvent = new KeyboardEvent('keyup', { key: 'Alt' });
          window.dispatchEvent(altUpEvent);
          break;

        case 'clickOnPage':
          bringBrowserToTheFront(browserId);
          dispatch(setActiveBrowser(browserId));
          const clickEvent = new MouseEvent('click');
          window.dispatchEvent(clickEvent);
          break;

        case 'ctrl+Tab':
          const ctrlTabEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlTabEvent);
          break;

        case 'ctrl+shift+Tab':
          const ctrlShiftTabEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            ctrlKey: true,
            shiftKey: true,
          });
          window.dispatchEvent(ctrlShiftTabEvent);
          break;

        case 'ctrl+t':
          const ctrlTEvent = new KeyboardEvent('keydown', {
            key: 't',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlTEvent);
          break;

        case 'ctrl+shift+T':
          const ctrlShiftTEvent = new KeyboardEvent('keydown', {
            key: 'T',
            ctrlKey: true,
            shiftKey: true,
          });
          window.dispatchEvent(ctrlShiftTEvent);
          break;

        case 'ctrl+r':
          const ctrlREvent = new KeyboardEvent('keydown', {
            key: 'r',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlREvent);
          break;

        case 'ctrl+w':
          const ctrlWEvent = new KeyboardEvent('keydown', {
            key: 'w',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlWEvent);
          break;

        case 'ctrl+shift+W':
          const ctrlShiftWEvent = new KeyboardEvent('keydown', {
            key: 'W',
            ctrlKey: true,
            shiftKey: true,
          });
          window.dispatchEvent(ctrlShiftWEvent);
          break;

        case 'ctrl+f':
          const ctrlFEvent = new KeyboardEvent('keydown', {
            key: 'f',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlFEvent);
          break;

        case 'created-webcontents':
          dispatch(
            updateBrowser({
              browserId,
              params: { webContentsId: e.args[0].webContentsId },
            })
          );
          window.app.browser.requestCapture(e.args[0].webContentsId);
          break;

        case 'install-extension':
          window.app.extension.installExtension(e.args[0]);
          break;
      }
    },
    [browserId, dispatch, bringBrowserToTheFront]
  );

  const loadCommitListener = useCallback(
    (e: LoadCommitEvent) => {
      const target = e.target as HTMLSourceElement;
      if (e.url !== 'https://web.whatsapp.com/' || e.url !== browser?.url) {
        setTimeout(() => {
          dispatch(
            updateBrowserUrl({
              url: target?.src,
              browserId,
            })
          );
        }, 0);

        helpers.browser.requestCapture(browserId);
      }
    },
    [browserId, dispatch, helpers.browser, browser?.url]
  );

  const pageFaviconUpdatedListener = useCallback(
    (e: PageFaviconUpdatedEvent) => {
      dispatch(
        updateBrowserFav({
          favicon: e.favicons[0],
          browserId,
        })
      );
    },
    [browserId, dispatch]
  );

  const didFinishLoadListener = useCallback(
    (e: any) => {
      if (
        e.target.src !== 'https://web.whatsapp.com/' ||
        e.target.src !== browser?.url ||
        browser?.isLoading
      ) {
        webview?.blur();
        webview?.focus();

        dispatch(
          updateBrowserLoading({
            isLoading: false,
            browserId,
          })
        );

        helpers.browser.requestCapture(browserId);
      }
    },
    [
      browserId,
      dispatch,
      webview,
      helpers.browser,
      browser?.url,
      browser?.isLoading,
    ]
  );

  const didStartLoadListener = useCallback(
    (e: any) => {
      if (
        e.target.src !== 'https://web.whatsapp.com/' ||
        e.target.src !== browser?.url
      ) {
        dispatch(
          updateBrowserLoading({
            isLoading: true,
            browserId,
          })
        );
      }
    },
    [browserId, dispatch, browser?.url]
  );

  const pageTitleUpdatedListener = useCallback(
    (e: PageTitleUpdatedEvent) => {
      dispatch(updateBrowserTitle({ browserId, title: e.title }));
    },
    [browserId, dispatch]
  );

  const containerClickListener = useCallback(() => {
    bringBrowserToTheFront(browserId);
    dispatch(setActiveBrowser(browserId));
  }, [browserId, dispatch, bringBrowserToTheFront]);

  useEffect(() => {
    webview?.addEventListener('did-stop-loading', didFinishLoadListener);
    webview?.addEventListener('did-start-loading', didStartLoadListener);
    webview?.addEventListener('load-commit', loadCommitListener);
    webview?.addEventListener('page-title-updated', pageTitleUpdatedListener);
    webview?.addEventListener(
      'page-favicon-updated',
      pageFaviconUpdatedListener
    );
    // @ts-ignore
    webview?.addEventListener('ipc-message', ipcMessageListener);
    container?.addEventListener('mousedown', containerClickListener);

    return () => {
      webview?.removeEventListener('did-stop-loading', didFinishLoadListener);
      webview?.removeEventListener('did-start-loading', didStartLoadListener);
      webview?.removeEventListener('load-commit', loadCommitListener);
      webview?.removeEventListener(
        'page-title-updated',
        pageTitleUpdatedListener
      );
      webview?.removeEventListener(
        'page-favicon-updated',
        pageFaviconUpdatedListener
      );
      // @ts-ignore
      webview?.removeEventListener('ipc-message', ipcMessageListener);

      container?.removeEventListener('mousedown', containerClickListener);
    };
  }, [
    loadCommitListener,
    pageFaviconUpdatedListener,
    pageTitleUpdatedListener,
    containerClickListener,
    ipcMessageListener,
    container,
    webview,
    didFinishLoadListener,
    didStartLoadListener,
  ]);
};
