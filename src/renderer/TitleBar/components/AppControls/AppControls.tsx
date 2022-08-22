/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MinimizeIcon from '@mui/icons-material/Minimize';

import { Unmaximize } from './Unmaximize';

import './style.scss';

export const AppControls: React.FC = () => {
  const [isMaximized, setIsMaxmized] = useState<boolean>(false);

  const handleClickMaximize = () => {
    window.titleBar.app.maximize();
    window.titleBar.app
      .isMaximized()
      .then((res) => {
        setIsMaxmized(res);
        return null;
      })
      .catch(console.log);
  };

  useEffect(() => {
    setTimeout(() => {
      window.titleBar.app
        .isMaximized()
        .then((res) => {
          setIsMaxmized(res);
          return null;
        })
        .catch(console.log);
    }, 1500);
  }, []);

  return (
    <div id="AppControls__container">
      <div
        className="AppControls__item"
        onClick={() => window.titleBar.app.minimize()}
      >
        <MinimizeIcon />
      </div>
      <div className="AppControls__item" onClick={handleClickMaximize}>
        {isMaximized ? <Unmaximize /> : <CropSquareIcon />}
      </div>
      <div
        className="AppControls__item close-button"
        onClick={() => window.titleBar.app.close()}
      >
        <CloseIcon />
      </div>
    </div>
  );
};
