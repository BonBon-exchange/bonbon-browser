/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MinimizeIcon from '@mui/icons-material/Minimize';

import './style.scss';

export const AppControls: React.FC = () => {
  return (
    <div id="AppControls__container">
      <div
        className="AppControls__item"
        onClick={() => window.titleBar.app.minimize()}
      >
        <MinimizeIcon />
      </div>
      <div
        className="AppControls__item"
        onClick={() => window.titleBar.app.maximize()}
      >
        <CropSquareIcon />
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
