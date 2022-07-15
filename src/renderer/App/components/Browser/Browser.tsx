/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import clsx from 'clsx';

import { useBrowserEvents } from 'renderer/App/hooks/useBrowserEvents';
import { BrowserControlBar } from 'renderer/App/components/BrowserControlBar';
import { BrowserTopBar } from 'renderer/App/components/BrowserTopBar';
import { CertificateErrorPage } from 'renderer/App/components/CertificateErrorPage';
import { SearchForm } from 'renderer/App/components/SearchForm';
import { useAppDispatch } from 'renderer/App/store/hooks';
import {
  updateBrowserUrl,
  updateBrowser,
  toggleBoardFullSize,
} from 'renderer/App/store/reducers/Board';
import { useBoard } from 'renderer/App/hooks/useBoard';
import { useBrowserMethods } from 'renderer/App/hooks/useBrowserMethods';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';

import { BrowserProps } from './Types';

import './style.scss';

export const Browser: React.FC<BrowserProps> = ({
  id,
  url,
  top,
  left,
  height,
  width,
  firstRendering,
  favicon,
  title,
  isLoading,
  isMinimized,
  certificateErrorFingerprint,
  webContentsId,
  isSearching,
}) => {
  useBrowserEvents(id);
  const dispatch = useAppDispatch();
  const {
    enablePointerEventsForAll,
    disablePointerEventsForAll,
    focus,
    bringBrowserToTheFront,
  } = useBrowserMethods();
  const { browser } = useStoreHelpers();
  const board = useBoard();
  const [firstRenderingState, setFirstRenderingState] = useState<boolean>(
    firstRendering || true
  );
  const [renderedUrl, setRenderedUrl] = useState<string>('');
  const container = useRef<HTMLDivElement>(null);
  const [isFullSize, setIsFullSize] = useState<boolean>(false);

  const webview = container.current?.querySelector(
    'webview'
  ) as Electron.WebviewTag;

  const getOffset = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  };

  const onDragStart = () => {
    disablePointerEventsForAll();
  };

  const onDragStop = (e: any) => {
    dispatch(
      updateBrowser({
        browserId: id,
        params: {
          top: getOffset(e.target).top,
          left: getOffset(e.target).left,
        },
      })
    );

    enablePointerEventsForAll();
  };

  const onResizeStop = (delta: { width: number; height: number }) => {
    dispatch(
      updateBrowser({
        browserId: id,
        params: { width: width + delta.width, height: height + delta.height },
      })
    );
    enablePointerEventsForAll();
  };

  const onResizeStart = () => {
    disablePointerEventsForAll();
  };

  const toggleFullsizeBrowser = () => {
    dispatch(toggleBoardFullSize());
  };

  const goBack = () => {
    webview?.goBack();
    window.app.analytics.event('browser_go_back');
  };

  const goForward = () => {
    webview?.goForward();
    window.app.analytics.event('browser_go_forward');
  };

  const reload = () => {
    webview?.reload();
    window.app.analytics.event('browser_reload');
  };

  const goHome = () => {
    window.app.config.get('browsing.defaultWebpage').then((val) => {
      const defaultWebpage = val as string;
      webview?.loadURL(defaultWebpage).catch(console.log);
      dispatch(
        updateBrowserUrl({
          url: defaultWebpage,
          browserId: id,
        })
      );
    });
  };

  useEffect(() => {
    if (firstRenderingState) {
      setFirstRenderingState(false);
      setRenderedUrl(url);
    }
  }, [firstRenderingState, url]);

  useEffect(() => {
    bringBrowserToTheFront(document, document.querySelector(`#Browser__${id}`));
  }, [id, bringBrowserToTheFront]);

  useEffect(() => {
    window.app.analytics.event('browser_navigate');
    window.app.config.get('browsing.dontSaveHistory').then((val: unknown) => {
      const typedVal = val as boolean | undefined;
      if (!typedVal) window.app.db.addHistory({ url, title: title || '' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Bug fix for Rnd renderer
  useEffect(() => {
    if (board?.isFullSize) {
      setIsFullSize(true);
    } else {
      setIsFullSize(false);
    }
  }, [board?.isFullSize]);

  return (
    <Rnd
      style={{ display: 'flex' }}
      default={{
        x: left,
        y: top,
        width,
        height,
      }}
      dragHandleClassName="BrowserTopBar__container"
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStop={(_e, _dir, _ref, delta, _pos) => onResizeStop(delta)}
      onResizeStart={onResizeStart}
      bounds=".Board__container"
      id={`Browser__${id}`}
      className={clsx({
        'Browser__is-full-size': isFullSize,
        'Browser__is-minimized': isMinimized,
        'Browser__draggable-container': true,
      })}
      disableDragging={board?.isFullSize}
      enableResizing={board?.isFullSize ? {} : undefined}
      data-testid="browser-window"
    >
      <div className="Browser__container" ref={container}>
        <BrowserTopBar
          closeBrowser={() => browser.close(id)}
          minimizeBrowser={() => browser.minimize(id)}
          toggleFullsizeBrowser={toggleFullsizeBrowser}
          onClick={() => focus(document, id, true)}
          title={title}
          favicon={favicon}
          isLoading={isLoading}
        />
        <BrowserControlBar
          goBack={goBack}
          goForward={goForward}
          reload={reload}
          goHome={goHome}
          url={url}
          browserId={id}
        />
        <div className="Browser__webview-container">
          {isSearching && <SearchForm browserId={id} />}
          {certificateErrorFingerprint && webContentsId && (
            <CertificateErrorPage
              reload={reload}
              webContentsId={webContentsId}
              fingerprint={certificateErrorFingerprint}
              browserId={id}
            />
          )}
          <webview
            // @ts-ignore
            allowpopups="true"
            src={renderedUrl}
            partition="persist:user-partition"
          />
        </div>
      </div>
    </Rnd>
  );
};
