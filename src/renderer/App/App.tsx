/* eslint-disable import/prefer-default-export */
import { useState, useRef, useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, getPersistedStoreAndPersistor } from 'renderer/App/store/store';
import { Addaps } from 'renderer/App/components/Addaps';
import ErrorFallback from 'renderer/App/components/ErrorFallback';
import { Ping } from 'renderer/App/components/Ping';
import { useAnalytics } from './hooks/useAnalytics';

import './i18n';

import 'renderer/App/style/dark.css';
import 'renderer/App/style/light.css';
import './App.css';

export function App() {
  const [isLoadedBoard, setIsLoadedBoard] = useState<boolean | string>(false);
  const [boardId, setBoardId] = useState<string>('');
  const persisted = useRef<any>(null);
  const { anal } = useAnalytics();

  const loadBoardAction = useCallback(
    (_e: any, args: { boardId: string }) => {
      if (args.boardId === boardId) return;
      anal.logEvent('load_board');
      persisted.current = getPersistedStoreAndPersistor(args.boardId);
      setBoardId(args.boardId);
      setIsLoadedBoard(true);
    },
    [anal, boardId]
  );

  const purgeAction = useCallback(() => {
    if (persisted.current?.persistor) {
      persisted.current?.persistor.purge();
      localStorage.removeItem(`persist:${boardId}`);
    }
  }, [boardId]);

  useEffect(() => {
    window.app.listener.loadBoard(loadBoardAction);
    return () => window.app.off.loadBoard();
  }, [loadBoardAction]);

  useEffect(() => {
    window.app.listener.purge(purgeAction);
    return () => window.app.off.purge();
  }, [purgeAction]);

  useEffect(() => {
    anal.logEvent('load_app');
  }, [anal]);

  useEffect(() => {
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      anal.logEvent('right-click');
      const target = e.target as HTMLDivElement;

      if (
        document
          .getElementById('LeftBar__browserFavContainerItems')
          ?.contains(target)
      )
        window.app.tools.showLeftbarContextMenu({ x: e.clientX, y: e.clientY });
    });
  }, [anal]);

  return (
    <ErrorFallback>
      {isLoadedBoard ? (
        <Provider store={persisted.current?.store}>
          <PersistGate loading={null} persistor={persisted.current?.persistor}>
            <Ping />
            <Addaps boardId={boardId} />
          </PersistGate>
        </Provider>
      ) : (
        <Provider store={store}>
          <Ping />
          <Addaps />
        </Provider>
      )}
    </ErrorFallback>
  );
}
