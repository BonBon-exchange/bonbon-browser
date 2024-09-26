/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MinimizeIcon from '@mui/icons-material/Minimize';
import clsx from 'clsx';
import { useState } from 'react';

import Unmaximize from 'renderer/App/components/Unmaximize';
import MacOSControls from 'renderer/App/components/MacOSControls';
import { useSettings } from 'renderer/App/hooks/useSettings';
import { useBoard } from 'renderer/App/hooks/useBoard';

import loadingImg from 'renderer/App/svg/loading.svg';

import { BrowserTopBarProps } from './Types';

import './style.scss';

export const BrowserTopBar = ({
  closeBrowser,
  toggleFullSizeBrowser,
  minimizeBrowser,
  title,
  favicon,
  onClick,
  isLoading,
  isMaximized,
  isPinned,
}: BrowserTopBarProps) => {
  const settings = useSettings();
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const board = useBoard();

  const onMouseLeave = () => {
    if (isMouseDown && board.isFullSize) toggleFullSizeBrowser();
  };

  return (
    <div
      className={clsx(
        {
          macos:
            window.app.os.getPlatform() === 'darwin' ||
            settings['application.forceMacosStyle'],
        },
        'BrowserTopBar__container'
      )}
      onDoubleClick={toggleFullSizeBrowser}
      onClick={onClick}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={onMouseLeave}
    >
      {(window.app.os.getPlatform() === 'darwin' ||
        settings['application.forceMacosStyle']) && (
        <Controls
          closeBrowser={closeBrowser}
          minimizeBrowser={minimizeBrowser}
          isMaximized={isMaximized}
          toggleFullSizeBrowser={toggleFullSizeBrowser}
          isPinned={isPinned}
        />
      )}
      {favicon && (
        <img
          src={isLoading ? loadingImg : favicon}
          width="16"
          height="16"
          className="BrowserTopBar__favicon"
        />
      )}
      <div className="BrowserTopBar__title">{title || ''}</div>
      {window.app.os.getPlatform() !== 'darwin' &&
        !settings['application.forceMacosStyle'] && (
          <Controls
            closeBrowser={closeBrowser}
            minimizeBrowser={minimizeBrowser}
            isMaximized={isMaximized}
            toggleFullSizeBrowser={toggleFullSizeBrowser}
            isPinned={isPinned}
          />
        )}
    </div>
  );
};

const Controls = ({
  closeBrowser,
  toggleFullSizeBrowser,
  isMaximized,
  minimizeBrowser,
  isPinned,
}: {
  closeBrowser: () => void;
  toggleFullSizeBrowser: () => void;
  minimizeBrowser: () => void;
  isMaximized: boolean;
  isPinned: boolean;
}) => {
  const settings = useSettings();
  return (
    <div
      className={clsx(
        {
          macos:
            window.app.os.getPlatform() === 'darwin' ||
            settings['application.forceMacosStyle'],
        },
        'BrowserTopBar__controls'
      )}
    >
      {window.app.os.getPlatform() !== 'darwin' &&
        !settings['application.forceMacosStyle'] && (
          <>
            {!isPinned && (
              <div
                className="BrowserTopBar__control-button close-button"
                onClick={closeBrowser}
                data-testid="close-browser"
              >
                <CloseIcon />
              </div>
            )}
            <div
              className="BrowserTopBar__control-button"
              onClick={toggleFullSizeBrowser}
              data-testid="toggle-enlarge-browser"
            >
              {isMaximized ? <Unmaximize /> : <CropSquareIcon />}
            </div>
            <div
              className="BrowserTopBar__control-button"
              onClick={minimizeBrowser}
              data-testid="minimize-browser"
            >
              <MinimizeIcon />
            </div>
          </>
        )}

      {(window.app.os.getPlatform() === 'darwin' ||
        settings['application.forceMacosStyle']) && (
        <MacOSControls
          isPinned={isPinned}
          closeBrowser={closeBrowser}
          minimizeBrowser={minimizeBrowser}
          toggleFullSizeBrowser={toggleFullSizeBrowser}
        />
      )}
    </div>
  );
};
