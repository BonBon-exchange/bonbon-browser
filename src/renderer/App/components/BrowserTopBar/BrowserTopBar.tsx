/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MinimizeIcon from '@mui/icons-material/Minimize';
import clsx from 'clsx';

import { Unmaximize } from 'renderer/App/components/Unmaximize';

import loadingImg from 'renderer/App/svg/loading.svg';

import { BrowserTopBarProps } from './Types';

import './style.scss';
import { MacOSControls } from '../MacOSControls/MacOSControls';

export const BrowserTopBar = ({
  closeBrowser,
  toggleFullSizeBrowser,
  minimizeBrowser,
  title,
  favicon,
  onClick,
  isLoading,
  isMaximized,
}: BrowserTopBarProps) => {
  return (
    <div
      className={clsx({'macos': window.app.os.getPlatform() === 'darwin'}, "BrowserTopBar__container")}
      onDoubleClick={toggleFullSizeBrowser}
      onClick={onClick}
    >
      {
        window.app.os.getPlatform() === 'darwin' && (
          <Controls 
            closeBrowser={closeBrowser}
            minimizeBrowser={minimizeBrowser}
            isMaximized={isMaximized}
            toggleFullSizeBrowser={toggleFullSizeBrowser}
            />
        )
      }
      {favicon && (
        <img
          src={isLoading ? loadingImg : favicon}
          width="16"
          height="16"
          className="BrowserTopBar__favicon"
        />
      )}
      <div className="BrowserTopBar__title">{title || ''}</div>
      {
        window.app.os.getPlatform() !== 'darwin' && (
          <Controls 
            closeBrowser={closeBrowser}
            minimizeBrowser={minimizeBrowser}
            isMaximized={isMaximized}
            toggleFullSizeBrowser={toggleFullSizeBrowser}
            />
        )
      }
    </div>
  );
};

const Controls = ({
  closeBrowser,
  toggleFullSizeBrowser,
  isMaximized,
  minimizeBrowser
}: {
  closeBrowser: () => void
  toggleFullSizeBrowser: () => void
  minimizeBrowser: () => void
  isMaximized: boolean
}) => {
  return (
    <div className={clsx({'macos': window.app.os.getPlatform() === 'darwin'}, "BrowserTopBar__controls")}>
      {
        window.app.os.getPlatform() !== 'darwin' && (
          <>
            <div
          className="BrowserTopBar__control-button close-button"
          onClick={closeBrowser}
          data-testid="close-browser"
        >
          <CloseIcon />
        </div>
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
        )
      }

      {
        window.app.os.getPlatform() === 'darwin' && (<MacOSControls closeBrowser={closeBrowser} minimizeBrowser={minimizeBrowser} toggleFullSizeBrowser={toggleFullSizeBrowser}/>)
      }
      
    </div>
  )
}