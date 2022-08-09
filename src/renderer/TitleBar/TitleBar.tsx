/* eslint-disable import/prefer-default-export */
import { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { TopBar } from 'renderer/TitleBar/components/TopBar';
import { store, persistor } from 'renderer/TitleBar/store/store';

import './TitleBar.scss';
import 'renderer/TitleBar/style/dark.css';
import 'renderer/TitleBar/style/light.css';

export const TitleBar: React.FC = () => {
  const contextMenuListener = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;

    if (target.className.includes && target.className.includes('TopBar__tab'))
      window.titleBar.app.showTabContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('contextmenu', contextMenuListener);
    return () => window.removeEventListener('contextmenu', contextMenuListener);
  }, [contextMenuListener]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div id="TitleBar__container">
          <TopBar />
        </div>
      </PersistGate>
    </Provider>
  );
};
