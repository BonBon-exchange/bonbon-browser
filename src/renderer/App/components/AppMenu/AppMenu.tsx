/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { AppMenuProps } from './Types';

import './style.scss';

export const AppMenu: React.FC<AppMenuProps> = ({
  showAbout,
  showSettings,
}: AppMenuProps) => {
  return (
    <div id="AppMenu__container">
      <ul>
        <li onClick={() => window.app.tools.toggleDarkMode()}>
          Toggle dark mode
        </li>
        <li onClick={() => showSettings()}>Settings</li>
        <li onClick={() => showAbout()}>About</li>
      </ul>
    </div>
  );
};
