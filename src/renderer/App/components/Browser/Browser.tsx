/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { useBrowserEvents } from 'renderer/App/hooks/useBrowserEvents';
import { BrowserControlBar } from 'renderer/App/components/BrowserControlBar';
import { BrowserTopBar } from 'renderer/App/components/BrowserTopBar';
import { CertificateErrorPage } from 'renderer/App/components/CertificateErrorPage';
import { SearchForm } from 'renderer/App/components/SearchForm';
import { useAppDispatch } from 'renderer/App/store/hooks';
import {
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
  const [x, setX] = useState<number>(left);
  const [y, setY] = useState<number>(top);
  const [rndWidth, setRndWidth] = useState<number>(width);
  const [rndHeight, setRndHeight] = useState<number>(height);

  const webview = container.current?.querySelector(
    'webview'
  ) as Electron.WebviewTag;

  const edgeLeft = document.querySelector('.Board__edge-snap-left');
  const edgeRight = document.querySelector('.Board__edge-snap-right');
  const edgeMaximized = document.querySelector('.Board__edge-snap-maximized');

  const toggleFullsizeBrowser = () => {
    dispatch(toggleBoardFullSize());
    setTimeout(() => focus(id), 0);
  };

  const onDrag = (_e: any, d: { x: number; y: number }) => {
    const edgeRightWidth = container.current?.clientWidth
      ? container.current?.clientWidth
      : 0;
    const edgeRightValue = window.innerWidth - edgeRightWidth - 69;

    if (d.x === 0) {
      // @ts-ignore
      edgeLeft.style.display = 'block';
    } else {
      // @ts-ignore
      edgeLeft.style.display = 'none';
    }
    if (d.x === edgeRightValue) {
      // @ts-ignore
      edgeRight.style.display = 'block';
    } else {
      // @ts-ignore
      edgeRight.style.display = 'none';
    }

    if (d.y - window.scrollY <= 20) {
      // @ts-ignore
      edgeMaximized.style.display = 'block';
    } else {
      // @ts-ignore
      edgeMaximized.style.display = 'none';
    }
  };

  const onDragStart = () => {
    disablePointerEventsForAll();
  };

  const onDragStop = (_e: any, d: any) => {
    const scrollTop = window.pageYOffset;
    // @ts-ignore
    edgeRight.style.display = 'none';
    // @ts-ignore
    edgeLeft.style.display = 'none';
    // @ts-ignore
    edgeMaximized.style.display = 'none';

    const edgeRightWidth = container.current?.clientWidth
      ? container.current?.clientWidth
      : 0;
    const edgeRightValue = window.innerWidth - edgeRightWidth - 69;
    const edgeTopValue = d.y - window.scrollY;

    switch (d.x) {
      case 0:
        setX(10);
        setY(10 + scrollTop);
        setRndWidth(window.innerWidth / 2 - 55);
        setRndHeight(window.innerHeight - 20);
        dispatch(
          updateBrowser({
            browserId: id,
            params: {
              top: 10 + scrollTop,
              left: 10,
              width: window.innerWidth / 2 - 55,
              height: window.innerHeight - 20,
            },
          })
        );
        break;

      case edgeRightValue:
        setX(window.innerWidth / 2 - 20);
        setY(10 + scrollTop);
        setRndWidth(window.innerWidth / 2 - 55);
        setRndHeight(window.innerHeight - 20);
        dispatch(
          updateBrowser({
            browserId: id,
            params: {
              top: 10 + scrollTop,
              left: window.innerWidth / 2 - 20,
              width: window.innerWidth / 2 - 55,
              height: window.innerHeight - 20,
            },
          })
        );
        break;

      default:
        if (edgeTopValue <= 0) {
          window.app.config.get('browsing.topEdge').then((res: unknown) => {
            if (res === 'maximize') {
              toggleFullsizeBrowser();
              focus(id, true);
            }
            if (res === 'fit') {
              setX(10);
              setY(10 + scrollTop);
              setRndWidth(window.innerWidth - 85);
              setRndHeight(window.innerHeight - 20);
              dispatch(
                updateBrowser({
                  browserId: id,
                  params: {
                    top: 10 + scrollTop,
                    left: 10,
                    width: window.innerWidth - 85,
                    height: window.innerHeight - 20,
                  },
                })
              );
            }
          });
        } else {
          setX(d.x);
          setY(d.y);
          dispatch(
            updateBrowser({
              browserId: id,
              params: {
                top: d.y,
                left: d.x,
              },
            })
          );
        }
        break;
    }
    enablePointerEventsForAll();
  };

  const onResizeStop = (
    ref: { offsetWidth: number; offsetHeight: number },
    position: { x: number; y: number }
  ) => {
    setX(position.x);
    setY(position.y);
    setRndWidth(ref.offsetWidth);
    setRndHeight(ref.offsetHeight);
    dispatch(
      updateBrowser({
        browserId: id,
        params: {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          left: position.x,
          top: position.y,
        },
      })
    );
    enablePointerEventsForAll();
  };

  const onResizeStart = () => {
    disablePointerEventsForAll();
  };

  const reload = () => {
    webview?.reload();
    window.app.analytics.event('browser_reload');
  };

  useEffect(() => {
    if (firstRenderingState) {
      setFirstRenderingState(false);
      setRenderedUrl(url);
    }
  }, [firstRenderingState, url]);

  useEffect(() => {
    bringBrowserToTheFront(id);
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

  useEffect(() => {
    setX(left);
    setY(top);
    setRndWidth(width);
    setRndHeight(height);
  }, [left, top, width, height]);

  return (
    <Rnd
      style={{ display: 'flex' }}
      default={{
        x: left,
        y: top,
        width,
        height,
      }}
      position={{
        x,
        y,
      }}
      size={{
        width: rndWidth,
        height: rndHeight,
      }}
      dragHandleClassName="BrowserTopBar__container"
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onDrag={onDrag}
      onResizeStop={(_e, _dir, ref, _delta, pos) => onResizeStop(ref, pos)}
      onResizeStart={onResizeStart}
      bounds="#Board__container"
      id={`Browser__${id}`}
      className={clsx({
        'Browser__is-full-size': isFullSize,
        'Browser__is-minimized': isMinimized,
        'Browser__draggable-container': true,
      })}
      disableDragging={board?.isFullSize}
      enableResizing={board?.isFullSize ? {} : undefined}
      data-testid="browser-window"
      data-id={id}
    >
      <motion.div
        className="Browser__container"
        ref={container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        layout={!board?.isFullSize}
      >
        <BrowserTopBar
          closeBrowser={() => setTimeout(() => browser.close(id), 0)}
          minimizeBrowser={() => browser.minimize(id)}
          toggleFullsizeBrowser={toggleFullsizeBrowser}
          onClick={() => focus(id, true)}
          title={title}
          favicon={favicon}
          isLoading={isLoading}
        />
        <BrowserControlBar url={url} browserId={id} />
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
      </motion.div>
    </Rnd>
  );
};
