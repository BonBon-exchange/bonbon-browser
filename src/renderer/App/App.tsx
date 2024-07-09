/* eslint-disable import/prefer-default-export */
import { useState, useRef, useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { IpcRendererEvent } from 'electron';

import { store, getPersistedStoreAndPersistor } from 'renderer/App/store/store';
import { Addaps } from 'renderer/App/components/Addaps';
import ChatBar from 'renderer/App/components/ChatBar/ChatBar';

import './i18n';

import 'renderer/App/style/dark.css';
import 'renderer/App/style/light.css';
import './App.css';

export function App() {
  const [isLoadedBoard, setIsLoadedBoard] = useState<boolean | string>(false);
  const [boardId, setBoardId] = useState<string>('');
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [chatState, setChatState] = useState<{
    isMagic: boolean;
    username: string;
  }>({
    isMagic: false,
    username: '',
  });
  const persisted = useRef<any>(null);

  const loadBoardAction = useCallback(
    (_e: IpcRendererEvent, args: { boardId: string }) => {
      if (args.boardId === boardId) return;
      persisted.current = getPersistedStoreAndPersistor(args.boardId);
      setBoardId(args.boardId);
      setIsLoadedBoard(true);
    },
    [boardId]
  );

  const purgeAction = useCallback(() => {
    if (persisted.current?.persistor) {
      persisted.current?.persistor.purge();
      localStorage.removeItem(`persist:${boardId}`);
    }
  }, [boardId]);

  const handleInitChat = useCallback(() => {
    setIsChatActive(true);
  }, [setIsChatActive]);

  const handleEndChat = useCallback(() => {
    setIsChatActive(false);
    setChatState({
      username: '',
      isMagic: false,
    });
  }, [setIsChatActive, setChatState]);

  const handleChatState = useCallback(
    (
      _e: IpcRendererEvent,
      args: {
        chatState: {
          isMagic: boolean;
          username: string;
        };
      }
    ) => {
      console.log({ args });
      setChatState(args.chatState);
    },
    [setChatState]
  );

  useEffect(() => {
    window.app.listener.loadBoard(loadBoardAction);
    return () => window.app.off.loadBoard();
  }, [loadBoardAction]);

  useEffect(() => {
    window.app.listener.purge(purgeAction);
    return () => window.app.off.purge();
  }, [purgeAction]);

  useEffect(() => {
    window.app.analytics.event('load_app');
  }, []);

  useEffect(() => {
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const target = e.target as HTMLDivElement;

      if (
        document
          .getElementById('LeftBar__browserFavContainerItems')
          ?.contains(target)
      )
        window.app.tools.showLeftbarContextMenu({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    window.app.listener.initChat(handleInitChat);
    return () => window.app.off.initChat();
  }, [handleInitChat]);

  useEffect(() => {
    window.app.listener.endChat(handleEndChat);
    return () => window.app.off.endChat();
  }, [handleEndChat]);

  useEffect(() => {
    window.app.listener.chatState(handleChatState);
    return () => window.app.off.chatState();
  }, [handleChatState]);

  useEffect(() => {
    localStorage.getItem('isChatActive') === 'true'
      ? setIsChatActive(true)
      : setIsChatActive(false);
  }, []);

  console.log({ isChatActive, chatState });

  return isLoadedBoard ? (
    <Provider store={persisted.current?.store}>
      <PersistGate loading={null} persistor={persisted.current?.persistor}>
        <Addaps boardId={boardId} />
        {isChatActive && (
          <ChatBar
            isMagic={chatState.isMagic}
            username={chatState.username}
            setChatState={setChatState}
          />
        )}
      </PersistGate>
    </Provider>
  ) : (
    <Provider store={store}>
      <Addaps />
    </Provider>
  );
}
