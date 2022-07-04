/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useCallback, useEffect, useState } from 'react';

import { useGlobalEvents } from 'renderer/App/hooks/useGlobalEvents';
import { Board } from 'renderer/App/components/Board';
import { LeftBar } from 'renderer/App/components/LeftBar';
import { About } from 'renderer/App/components/About';
import { Popup } from 'renderer/App/components/Popup';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { AppMenu } from 'renderer/App/components/AppMenu';

import { AddapsProps } from './Types';

import './style.css';

export const Addaps: React.FC<AddapsProps> = ({ boardId }) => {
  useGlobalEvents();
  const { board } = useStoreHelpers({ boardId });
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showAppMenu, setShowAppMenu] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>('');
  const [popupChildren, setPopupChildren] = useState<JSX.Element>();

  const showAppMenuAction = useCallback(() => {
    setShowAppMenu(!showAppMenu);
  }, [showAppMenu]);

  const windowClickListener = () => {
    setShowAppMenu(false);
  };

  const showAbout = () => {
    setPopupChildren(<About />);
    setPopupTitle('About');
    setShowPopup(!showPopup);
    window.app.analytics.event('open_about');
  };

  useEffect(() => {
    if (boardId) board.load({ id: boardId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  useEffect(() => {
    window.app.listener.showAppMenu(showAppMenuAction);
    return () => window.app.off.showAppMenu();
  }, [showAppMenuAction]);

  useEffect(() => {
    window.addEventListener('click', windowClickListener);
    return () => window.removeEventListener('click', windowClickListener);
  }, []);

  return (
    <>
      <LeftBar />
      <Board />
      {showPopup && (
        <Popup title={popupTitle} closePopup={() => setShowPopup(false)}>
          {popupChildren}
        </Popup>
      )}
      {showAppMenu && <AppMenu showAbout={showAbout} />}
    </>
  );
};
