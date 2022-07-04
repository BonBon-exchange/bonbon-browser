/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import './style.scss';

export const AppMenu: React.FC = () => {
  return (
    <div id="AppMenu__container">
      <ul>
        <li onClick={() => window.app.tools.toggleDarkMode()}>
          Toggle dark mode
        </li>
        <li>About</li>
      </ul>
    </div>
  );
};
