/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useGlobalEvents } from 'renderer/App/hooks/useGlobalEvents';
import { Board } from 'renderer/App/components/Board';
import { LeftBar } from 'renderer/App/components/LeftBar';
import { About } from 'renderer/App/components/About';
import { Popup } from 'renderer/App/components/Popup';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { AppMenu } from 'renderer/App/components/AppMenu';
import { Settings } from 'renderer/App/components/Settings';
import { Bookmarks } from 'renderer/App/components/Bookmarks';
import { History } from 'renderer/App/components/History';
import { Downloads } from 'renderer/App/components/Downloads';
import { Documentation } from 'renderer/App/components/Documentation';
import { Extensions } from 'renderer/App/components/Extensions';
import { DownloadsPreview } from 'renderer/App/components/DownloadsPreview';
import { useAppSelector } from 'renderer/App/store/hooks';

import { AddapsProps } from './Types';

import './style.css';

export const Addaps: React.FC<AddapsProps> = ({ boardId }) => {
  useGlobalEvents();
  const { items } = useAppSelector((state) => state.downloads);
  const { board } = useStoreHelpers({ boardId });
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showDownloads, setShowDownloads] = useState<boolean>(false);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);
  const [showExtensions, setShowExtensions] = useState<boolean>(false);
  const [showAppMenu, setShowAppMenu] = useState<boolean>(false);
  const [showDownloadsPreview, setShowDownloadsPreview] =
    useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>('');
  const [popupChildren, setPopupChildren] = useState<JSX.Element>();
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
  };

  const showAbout = () => {
    setPopupChildren(<About />);
    setPopupTitle('About');
    setShowPopup(!showPopup);
    window.app.analytics.event('open_about');
  };

  const handleCloseSettings = () => setShowSettings(false);
  const handleCloseBookmarks = () => setShowBookmarks(false);
  const handleCloseHistory = () => setShowHistory(false);
  const handleCloseDownloads = () => setShowDownloads(false);
  const handleCloseDocumentation = () => setShowDocumentation(false);
  const handleCloseExtensions = () => setShowExtensions(false);

  const handleShowSettings = () => setShowSettings(true);
  const handleShowBookmarks = () => setShowBookmarks(true);
  const handleShowHistory = () => setShowHistory(true);
  const handleShowDownloads = () => setShowDownloads(true);
  const handleShowDocumentation = () => setShowDocumentation(true);
  const handleShowExtensions = () => setShowExtensions(true);

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

  return (
    <div
      className={clsx({
        'justify-content-right':
          i18n.language === 'ar' || i18n.language === 'fa',
      })}
    >
      <LeftBar />
      <Board
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
        />
      )}
      {showDownloadsPreview && <DownloadsPreview />}
      {showSettings && <Settings handleClose={handleCloseSettings} />}
      {showBookmarks && <Bookmarks handleClose={handleCloseBookmarks} />}
      {showHistory && <History handleClose={handleCloseHistory} />}
      {showDownloads && <Downloads handleClose={handleCloseDownloads} />}
      {showExtensions && <Extensions handleClose={handleCloseExtensions} />}
      {showDocumentation && (
        <Documentation handleClose={handleCloseDocumentation} />
      )}
    </div>
  );
};
