/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */

import './style.scss';

export const MacOSControls = ({
    closeBrowser,
    toggleFullSizeBrowser,
    minimizeBrowser
  }: {
    closeBrowser: () => void
    toggleFullSizeBrowser: () => void
    minimizeBrowser: () => void
  }) => {
    return (
        <div className="window-controls">
          <span className="control red" onClick={closeBrowser}/>
          <span className="control yellow" onClick={minimizeBrowser}/>
          <span className="control green" onClick={toggleFullSizeBrowser}/>
        </div>
    );
};
