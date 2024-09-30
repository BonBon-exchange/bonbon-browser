/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';

import { useBoard } from 'renderer/App/hooks/useBoard';
import { useGlobalEvents } from 'renderer/App/hooks/useGlobalEvents';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { useAppSelector, useAppDispatch } from 'renderer/App/store/hooks';
import { Loader } from 'renderer/App/components/Loader';
import { About } from 'renderer/App/components/About';
import ErrorFallback from 'renderer/App/components/ErrorFallback';
import { Chat } from 'renderer/App/components/Chat';
import { SettingsStateSynced } from 'renderer/App/components/SettingsStateSynced';
import {
  setInAppMenu,
  toggleMagicChat,
} from 'renderer/App/store/reducers/Board';
import { syncSettings } from 'renderer/App/store/reducers/Settings';
import { useSettings } from 'renderer/App/hooks/useSettings';

import { AddapsProps } from './Types';

import './style.css';

const Board = lazy(() => import('renderer/App/components/Board'));
const LeftBar = lazy(() => import('renderer/App/components/LeftBar'));
const DownloadsPreview = lazy(
  () => import('renderer/App/components/DownloadsPreview')
);
const Boards = lazy(() => import('renderer/App/components/Boards'));
const Settings = lazy(() => import('renderer/App/components/Settings'));
const Bookmarks = lazy(() => import('renderer/App/components/Bookmarks'));
const History = lazy(() => import('renderer/App/components/History'));
const Downloads = lazy(() => import('renderer/App/components/Downloads'));
const Extensions = lazy(() => import('renderer/App/components/Extensions'));
const Documentation = lazy(
  () => import('renderer/App/components/Documentation')
);
const Popup = lazy(() => import('renderer/App/components/Popup'));
const AppMenu = lazy(() => import('renderer/App/components/AppMenu'));
const Minimap = lazy(() => import('renderer/App/components/Minimap'));

export const Addaps = ({ boardId }: AddapsProps) => {
  useGlobalEvents();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const { items } = useAppSelector((state) => state.downloads);
  const { board } = useStoreHelpers({ boardId });
  const boardUsed = useBoard();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBoards, setShowBoards] = useState<boolean>(false);
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showDownloads, setShowDownloads] = useState<boolean>(false);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);
  const [showExtensions, setShowExtensions] = useState<boolean>(false);
  const [showAppMenu, setShowAppMenu] = useState<boolean>(false);
  const [showDownloadsPreview, setShowDownloadsPreview] =
    useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>('');
  const [popupChildren, setPopupChildren] = useState<React.JSX.Element>();
  const [showMinimap, setShowMinimap] = useState<boolean>(false);
  const [manualResetKey, setManualResetKey] = useState<string | undefined>();

  const { i18n } = useTranslation();

  const showAppMenuAction = useCallback(() => {
    setShowAppMenu(!showAppMenu);
    setShowDownloadsPreview(false);
  }, [showAppMenu]);

  const showDownloadsPreviewAction = useCallback(() => {
    if (items.length > 0) {
      setShowDownloadsPreview(!showDownloadsPreview);
      setShowAppMenu(false);
    } else {
      // show downloads
      setShowDownloads(true);
    }
  }, [showDownloadsPreview, items.length]);

  const windowClickListener = () => {
    setShowAppMenu(false);
    setShowDownloadsPreview(false);
    window.app.tools.clicked();
  };

  const minimapMouseEnterListener = () => {
    setShowMinimap(true);
  };

  const showAbout = () => {
    setPopupChildren(<About />);
    setPopupTitle('About');
    setShowPopup(!showPopup);
    window.app.analytics.event('open_about');
  };

  const handleCloseSettings = () => {
    dispatch(setInAppMenu(false));
    setShowSettings(false);
  };

  const handleCloseBookmarks = () => {
    dispatch(setInAppMenu(false));
    setShowBookmarks(false);
  };

  const handleCloseHistory = () => {
    dispatch(setInAppMenu(false));
    setShowHistory(false);
  };

  const handleCloseDownloads = () => {
    dispatch(setInAppMenu(false));
    setShowDownloads(false);
  };

  const handleCloseDocumentation = () => {
    dispatch(setInAppMenu(false));
    setShowDocumentation(false);
  };

  const handleCloseExtensions = () => {
    dispatch(setInAppMenu(false));
    setShowExtensions(false);
  };

  const handleCloseBoards = () => {
    dispatch(setInAppMenu(false));
    setShowBoards(false);
  };

  const handleShowSettings = () => {
    dispatch(setInAppMenu(true));
    setShowSettings(true);
  };

  const handleShowBookmarks = () => {
    dispatch(setInAppMenu(true));
    setShowBookmarks(true);
  };

  const handleShowHistory = () => {
    dispatch(setInAppMenu(true));
    setShowHistory(true);
  };

  const handleShowDownloads = () => {
    dispatch(setInAppMenu(true));
    setShowDownloads(true);
  };

  const handleShowDocumentation = () => {
    dispatch(setInAppMenu(true));
    setShowDocumentation(true);
  };

  const handleShowExtensions = () => {
    dispatch(setInAppMenu(true));
    setShowExtensions(true);
  };

  const handleShowBoards = () => {
    dispatch(setInAppMenu(true));
    setShowBoards(true);
  };

  const resetBoardAction = useCallback(
    (_e: any, bId?: string) => {
      if (!bId || boardId === bId) {
        setManualResetKey(v4());
      }
    },
    [boardId]
  );

  useEffect(() => {
    if (boardId) board.load({ id: boardId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  useEffect(() => {
    window.app.listener.showAppMenu(showAppMenuAction);
    return () => window.app.off.showAppMenu();
  }, [showAppMenuAction]);

  useEffect(() => {
    window.app.listener.showDownloadsPreview(showDownloadsPreviewAction);
    return () => window.app.off.showDownloadsPreview();
  }, [showDownloadsPreviewAction]);

  useEffect(() => {
    window.addEventListener('click', windowClickListener);
    return () => window.removeEventListener('click', windowClickListener);
  }, []);

  useEffect(() => {
    document
      .querySelector('#Minimap__detection-zone')
      ?.addEventListener('mouseenter', minimapMouseEnterListener);
    return () =>
      document
        .querySelector('#Minimap__detection-zone')
        ?.removeEventListener('mouseenter', minimapMouseEnterListener);
  }, []);

  useEffect(() => {
    window.app.listener.resetBoard(resetBoardAction);
    return () => window.app.off.resetBoard();
  }, [resetBoardAction]);

  useEffect(() => {
    window.app.config
      .getAll()
      .then((res) => {
        dispatch(syncSettings(res));
      })
      .catch(console.log);
  }, [dispatch]);

  return (
    <ErrorFallback manualResetKey={manualResetKey}>
      <Suspense fallback={<Loader />}>
        <div
          id="Addaps__container"
          data-boardid={boardId}
          className={clsx({
            'justify-content-right':
              i18n.language === 'ar' || i18n.language === 'fa',
          })}
        >
          <div
            id="Addaps__background"
            style={{
              background: `linear-gradient(200.96deg, ${settings['application.backgroundGradientColors.0']} -29.09%, ${settings['application.backgroundGradientColors.1']} 51.77%, ${settings['application.backgroundGradientColors.2']} 129.35%)`,
            }}
          />
          <LeftBar />
          <Board
            boardId={boardId}
            isFullSize={
              showSettings ||
              showBookmarks ||
              showHistory ||
              showDownloads ||
              showDocumentation ||
              showExtensions
            }
          />
          {showPopup && (
            <Popup title={popupTitle} closePopup={() => setShowPopup(false)}>
              {popupChildren}
            </Popup>
          )}
          {showAppMenu && (
            <AppMenu
              showAbout={showAbout}
              showSettings={handleShowSettings}
              showBookmarks={handleShowBookmarks}
              showHistory={handleShowHistory}
              showDownloads={handleShowDownloads}
              showDocumentation={handleShowDocumentation}
              showExtensions={handleShowExtensions}
              showBoards={handleShowBoards}
            />
          )}
          {boardUsed.showMagicChat &&
            settings['chat.username'] &&
            settings['chat.userId'] && (
              <Chat handleClose={() => dispatch(toggleMagicChat())} />
            )}
          {showDownloadsPreview && <DownloadsPreview />}
          {showSettings && <Settings handleClose={handleCloseSettings} />}
          {showBoards && <Boards handleClose={handleCloseBoards} />}
          {showBookmarks && <Bookmarks handleClose={handleCloseBookmarks} />}
          {showHistory && <History handleClose={handleCloseHistory} />}
          {showDownloads && <Downloads handleClose={handleCloseDownloads} />}
          {showExtensions && <Extensions handleClose={handleCloseExtensions} />}
          {showDocumentation && (
            <Documentation handleClose={handleCloseDocumentation} />
          )}
          <div id="Minimap__detection-zone" />
          {(showMinimap || settings['application.minimapOn']) &&
            !boardUsed?.isFullSize &&
            !boardUsed.isInAppMenu &&
            !boardUsed.showMagicChat && (
              <Minimap handleHide={() => setShowMinimap(false)} />
            )}
        </div>
      </Suspense>
      {settings['chat.username'] && settings['chat.userId'] && (
        <SettingsStateSynced />
      )}
    </ErrorFallback>
  );
};
