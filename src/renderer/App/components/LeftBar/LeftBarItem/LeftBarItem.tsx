/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
import Tooltip from '@mui/material/Tooltip';
import { Reorder } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import clsx from 'clsx';
import { ReactEventHandler, useCallback, useEffect } from 'react';

import { BrowserProps } from 'renderer/App/components/Browser/Types';
import { useBrowserMethods } from 'renderer/App/hooks/useBrowserMethods';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { useBoard } from 'renderer/App/hooks/useBoard';

import loadingImg from 'renderer/App/images/loading.svg';
import icon from 'renderer/App/images/icon.png';

import './style.scss';

const handleImageError: ReactEventHandler<HTMLImageElement> = (e) => {
  const target = e.target as HTMLImageElement;
  target.src = icon;
};

export const LeftBarItem: React.FC<BrowserProps> = (b) => {
  const { focus } = useBrowserMethods();
  const { browser } = useStoreHelpers();
  const boardState = useBoard();
  const { id, title, isMinimized, isLoading, favicon } = b;

  const handleClickFavicon = useCallback(
    (browserId: string) => {
      browser.show(browserId);
      setTimeout(() => {
        focus(browserId);
      }, 0);
    },
    [focus, browser]
  );

  useEffect(() => {
    const container = document.querySelector(
      '#LeftBar__browserFavContainerItems'
    );
    if (boardState.activeBrowser === id && container) {
      container.scrollBy(0, container.scrollHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Reorder.Item key={`reorderItem-${id}`} value={b}>
      <Tooltip title={title || ''} placement="right" key={id}>
        <div className="LeftBar__browserContainer">
          <div
            className={
              !isMinimized
                ? 'LeftBar__closeBrowser'
                : 'LeftBar__maximizeBrowser'
            }
            onClick={() => {
              if (!isMinimized) {
                browser.close(id);
              }
            }}
          >
            {!isMinimized ? <CloseIcon /> : <OpenInFullIcon />}
          </div>
          <div
            className={clsx({
              selected: id === boardState.activeBrowser,
              LeftBar__browserFav: true,
            })}
            key={id}
            onClick={() => handleClickFavicon(id)}
            data-browserid={id}
          >
            <img
              src={isLoading ? loadingImg : favicon || icon}
              className="LeftBar__browserFavImg"
              onError={handleImageError}
            />
          </div>
        </div>
      </Tooltip>
    </Reorder.Item>
  );
};
