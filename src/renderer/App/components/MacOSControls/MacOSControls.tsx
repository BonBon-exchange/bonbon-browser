/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */

import './style.scss';

export const MacOSControls = ({
    closeBrowser,
    toggleFullSizeBrowser,
    minimizeBrowser,
    isPinned
  }: {
    closeBrowser: () => void
    toggleFullSizeBrowser: () => void
    minimizeBrowser: () => void
    isPinned: boolean
  }) => {
    return (
        <div className="window-controls">
          {!isPinned && <span className="control red" onClick={closeBrowser}/>}
          <span className="control yellow" onClick={minimizeBrowser}/>
          <span className="control green" onClick={toggleFullSizeBrowser}/>
        </div>
    );
};
