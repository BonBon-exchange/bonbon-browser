/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
import { Electron } from 'namespaces/_electronist';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Rnd } from 'react-rnd';

import { BrowserControlBar } from 'renderer/App/components/BrowserControlBar';
import { BrowserTopBar } from 'renderer/App/components/BrowserTopBar';
import { CertificateErrorPage } from 'renderer/App/components/CertificateErrorPage';
import { SearchForm } from 'renderer/App/components/SearchForm';
import ErrorFallback from 'renderer/App/components/ErrorFallback';
import { useBoard } from 'renderer/App/hooks/useBoard';
import { useBrowserEvents } from 'renderer/App/hooks/useBrowserEvents';
import { useBrowserMethods } from 'renderer/App/hooks/useBrowserMethods';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { useAppDispatch } from 'renderer/App/store/hooks';
import {
  setLastResizedBrowserDimensions,
  toggleBoardFullSize,
  updateBrowser,
} from 'renderer/App/store/reducers/Board';
import { useSettings } from 'renderer/App/hooks/useSettings';
import { useAnalytics } from 'renderer/App/hooks/useAnalytics';

import { BrowserProps } from './Types';

import './style.scss';

export const Browser = ({
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
  capture,
  session,
  isPinned,
  incognito,
}: BrowserProps) => {
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const { anal } = useAnalytics();
  const {
    enablePointerEventsForAll,
    disablePointerEventsForAll,
    focus,
    bringBrowserToTheFront,
  } = useBrowserMethods();
  const helpers = useStoreHelpers();
  const board = useBoard();
  const [firstRenderingState, setFirstRenderingState] = useState<boolean>(
    firstRendering || true
  );
  const [renderedUrl, setRenderedUrl] = useState<string>('');
  const container = useRef<HTMLDivElement>(null);
  const [x, setX] = useState<number>(left);
  const [y, setY] = useState<number>(top);
  const [rndWidth, setRndWidth] = useState<number>(width);
  const [rndHeight, setRndHeight] = useState<number>(height);
  const [scrollY, setScrollY] = useState<null | number>(null);
  const [hasBeenActive, setHasBeenActive] = useState<boolean>(
    board.activeBrowser === id
  );
  const blockScrollTimer = useRef<any>(null);
  const rndRef = useRef<Rnd>(null);
  const webviewRef = useRef<Electron.WebviewTag>(null);
  const [lastScreenshot, setLastScreenshot] = useState<number>(0);
  useBrowserEvents(id);

  const edgeLeft = document.querySelector('.Board__edge-snap-left');
  const edgeRight = document.querySelector('.Board__edge-snap-right');
  const edgeMaximized = document.querySelector('.Board__edge-snap-maximized');
  const boardContainer = document.querySelector('#Board__container');

  const toggleFullSizeBrowser = useCallback(() => {
    dispatch(toggleBoardFullSize());
  }, [dispatch]);

  const zoomEdgeClass = (edgeClass: Element | null, max = false) => {
    const boardWidth =
      document.getElementById('Board__container')?.clientWidth || 1024;
    // @ts-ignore
    edgeClass.style.opacity = '0.3';
    // @ts-ignore
    edgeClass.style.height = 'calc(100vh - 30px)';
    // @ts-ignore
    edgeClass.style.width = max
      ? `${boardWidth - 20}px`
      : `${boardWidth / 2 - 20}px`;
  };

  const resetEdgeClass = (edgeClass: Element | null) => {
    // @ts-ignore
    edgeClass.style.opacity = '0';
    // @ts-ignore
    edgeClass.style.height = '25vh';
    // @ts-ignore
    edgeClass.style.width = '25vw';
  };

  const onDrag = (_e: any, d: { x: number; y: number }) => {
    if (boardContainer) {
      const edgeRightWidth = container.current?.clientWidth
        ? container.current?.clientWidth
        : 0;
      const edgeRightValue =
        Number(boardContainer?.clientWidth) - Number(edgeRightWidth) - 2;
      if (d.y - window.scrollY <= 20) {
        if (!blockScrollTimer.current) {
          resetEdgeClass(edgeLeft);
          resetEdgeClass(edgeRight);
          zoomEdgeClass(edgeMaximized, true);
          setScrollY(window.scrollY);
          blockScrollTimer.current = setTimeout(() => {
            if (window.scrollY > 0) {
              setScrollY(null);
              resetEdgeClass(edgeMaximized);
            }
            blockScrollTimer.current = null;
          }, 1000);
        }
      } else {
        resetEdgeClass(edgeMaximized);

        if (d.x === 0) {
          zoomEdgeClass(edgeLeft);
        } else {
          resetEdgeClass(edgeLeft);
        }
        if (d.x === edgeRightValue) {
          zoomEdgeClass(edgeRight);
        } else {
          resetEdgeClass(edgeRight);
        }
      }
    }
  };

  const onDragStart = () => {
    blockScrollTimer.current = null;
    disablePointerEventsForAll();
    anal.logEvent('browser_drag');
  };

  const onDragStop = (_e: any, d: any) => {
    if (boardContainer) {
      const scrollTop = window.pageYOffset;
      resetEdgeClass(edgeRight);
      resetEdgeClass(edgeLeft);
      resetEdgeClass(edgeMaximized);

      const edgeRightWidth = Number(container.current?.clientWidth)
        ? Number(container.current?.clientWidth)
        : 0;
      const edgeRightValue =
        Number(boardContainer?.clientWidth) - Number(edgeRightWidth) - 2;
      const edgeTopValue = d.y - window.scrollY;

      let resizeWidth;
      let resizeHeight;

      switch (d.x) {
        case 0:
          resizeWidth = Number(boardContainer?.clientWidth) / 2 - 15;
          resizeHeight = window.innerHeight - 20;
          setX(10);
          setY(10 + scrollTop);
          setRndWidth(resizeWidth);
          setRndHeight(resizeHeight);
          dispatch(
            updateBrowser({
              browserId: id,
              params: {
                top: 10 + scrollTop,
                left: 10,
                width: resizeWidth,
                height: resizeHeight,
              },
            })
          );
          dispatch(
            setLastResizedBrowserDimensions([resizeWidth, resizeHeight])
          );
          break;

        case edgeRightValue:
          resizeWidth = Number(boardContainer?.clientWidth) / 2 - 15;
          resizeHeight = window.innerHeight - 20;
          setX(Number(boardContainer?.clientWidth) / 2 + 5);
          setY(10 + scrollTop);
          setRndWidth(resizeWidth);
          setRndHeight(resizeHeight);
          dispatch(
            updateBrowser({
              browserId: id,
              params: {
                top: 10 + scrollTop,
                left: Number(boardContainer?.clientWidth) / 2 + 5,
                width: resizeWidth,
                height: resizeHeight,
              },
            })
          );
          dispatch(
            setLastResizedBrowserDimensions([resizeWidth, resizeHeight])
          );
          break;

        default:
          if (edgeTopValue <= 0 && scrollY !== null) {
            if (settings['browsing.topEdge'] === 'maximize') {
              toggleFullSizeBrowser();
              focus(id, true);
            }
            if (settings['browsing.topEdge'] === 'fit') {
              resizeWidth = Number(boardContainer?.clientWidth) - 20;
              resizeHeight = window.innerHeight - 20;
              setX(10);
              setY(10 + scrollTop);
              setRndWidth(resizeWidth);
              setRndHeight(resizeHeight);
              dispatch(
                updateBrowser({
                  browserId: id,
                  params: {
                    top: 10 + scrollTop,
                    left: 10,
                    width: resizeWidth,
                    height: resizeHeight,
                  },
                })
              );
              dispatch(
                setLastResizedBrowserDimensions([resizeWidth, resizeHeight])
              );
            }
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
      setTimeout(() => {
        helpers.browser.requestCapture(id);
      }, 50);
      enablePointerEventsForAll();
      setScrollY(null);
    }
  };

  const onResizeStop = (
    ref: { offsetWidth: number; offsetHeight: number },
    position: { x: number; y: number }
  ) => {
    setX(position.x);
    setY(position.y);
    setRndWidth(ref.offsetWidth);
    setRndHeight(ref.offsetHeight);

    helpers.browser.requestCapture(id);
    enablePointerEventsForAll();

    dispatch(
      updateBrowser({
        browserId: id,
        params: {
          top: position.y,
          left: position.x,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        },
      })
    );
    dispatch(
      setLastResizedBrowserDimensions([ref.offsetWidth, ref.offsetHeight])
    );
  };

  const onResizeStart = () => {
    disablePointerEventsForAll();
    anal.logEvent('browser_resize');
  };

  const reload = useCallback(() => {
    webviewRef.current?.reload();
    anal.logEvent('browser_reload-page');
  }, [anal]);

  const scrollListener = useCallback(() => {
    const timestamp = new Date().getTime();
    if (scrollY) window.scrollTo(0, scrollY);
    if (
      window.scrollY < top &&
      (window.scrollY + window.innerHeight > top + height ||
        window.innerHeight < height) &&
      timestamp - lastScreenshot > 5000 &&
      (!capture || capture === 'data:image/png;base64,')
    ) {
      helpers.browser.requestCapture(id);
      setLastScreenshot(timestamp);
    }
  }, [scrollY, height, top, helpers.browser, id, lastScreenshot, capture]);

  const makeBrowser = useMemo(() => {
    return (
      <motion.div
        className="Browser__container"
        ref={container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BrowserTopBar
          closeBrowser={() => setTimeout(() => helpers.browser.close(id), 0)}
          minimizeBrowser={() => helpers.browser.minimize(id)}
          toggleFullSizeBrowser={toggleFullSizeBrowser}
          isPinned={isPinned}
          onClick={() => focus(id, true)}
          title={title}
          favicon={favicon}
          isLoading={isLoading}
          isMaximized={board.isFullSize}
        />
        <BrowserControlBar url={url || ''} browserId={id} />
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
            src={hasBeenActive || !board.isFullSize ? renderedUrl : undefined}
            partition={session ?? 'persist:user-partition'}
            ref={webviewRef}
          />
        </div>
      </motion.div>
    );
  }, [
    board.isFullSize,
    certificateErrorFingerprint,
    favicon,
    focus,
    hasBeenActive,
    helpers.browser,
    id,
    isLoading,
    isPinned,
    isSearching,
    reload,
    renderedUrl,
    session,
    title,
    toggleFullSizeBrowser,
    url,
    webContentsId,
  ]);

  useEffect(() => {
    if (id === board.activeBrowser || !board.isFullSize) setHasBeenActive(true);
  }, [board.activeBrowser, id, board.isFullSize]);

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
    anal.logEvent('browser_navigate');
    const typedVal = settings['browsing.dontSaveHistory'] as
      | boolean
      | undefined;
    if (!typedVal && !incognito)
      window.app.history
        .addHistory({ url, title: title || '' })
        .catch(console.log);
  }, [url, settings, title, incognito, anal]);

  useEffect(() => {
    const maxWidth = boardContainer?.clientWidth;
    const margin = 5;
    if (maxWidth) {
      const diff = left + width + margin - maxWidth;
      if (diff > 0) {
        if (width - diff > 300) {
          dispatch(
            updateBrowser({
              browserId: id,
              params: {
                width: width - diff,
              },
            })
          );
          setRndWidth(width - diff);
          setX(left);
        } else {
          dispatch(
            updateBrowser({
              browserId: id,
              params: {
                left: left - diff,
              },
            })
          );
          setX(left - diff);
          setRndWidth(width);
        }
      } else {
        setX(left);
        setY(top);
      }
    }
  }, [left, top, width, height, boardContainer, dispatch, id]);

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, [scrollListener]);

  useEffect(() => {
    const browser = board.browsers.find((b) => b.id === id);
    setRndWidth(browser?.width as number);
    setRndHeight(browser?.height as number);
  }, [board.browsers, id]);

  return (
    <ErrorFallback>
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
          'Browser__is-full-size': board.isFullSize && !firstRenderingState,
          'Browser__is-minimized': isMinimized,
          'Browser__display-none':
            board.isFullSize && id !== board.activeBrowser,
          'Browser__is-pinned': isPinned,
          'Browser__draggable-container': true,
        })}
        disableDragging={board.isFullSize || isPinned}
        enableResizing={board.isFullSize || isPinned ? {} : undefined}
        data-testid="browser-window"
        data-id={id}
        ref={rndRef}
      >
        {makeBrowser}
      </Rnd>
    </ErrorFallback>
  );
};
