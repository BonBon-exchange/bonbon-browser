/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';

import { BrowserTopBarProps } from './Types';

import './style.css';

export const BrowserTopBar: React.FC<BrowserTopBarProps> = ({
  closeBrowser,
  toggleFullsizeBrowser,
  title,
  favicon,
  onClick,
}) => {
  return (
    <div
      className="BrowserTopBar__container"
      onDoubleClick={toggleFullsizeBrowser}
      onClick={onClick}
    >
      {favicon && (
        <img
          src={favicon}
          width="16"
          height="16"
          className="BrowserTopBar__favicon"
        />
      )}
      <div className="BrowserTopBar__title">{title || ''}</div>
      <div className="BrowserTopBar__controls">
        <div
          className="BrowserTopBar__control-button"
          onClick={closeBrowser}
          data-testid="close-browser"
        >
          <CloseIcon />
        </div>
        <div
          className="BrowserTopBar__control-button"
          onClick={toggleFullsizeBrowser}
          data-testid="toggle-enlarge-browser"
        >
          <CropSquareIcon />
        </div>
      </div>
    </div>
  );
};
