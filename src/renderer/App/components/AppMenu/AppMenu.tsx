/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useTranslation } from 'react-i18next';

import { AppMenuProps } from './Types';

import './style.scss';

export const AppMenu: React.FC<AppMenuProps> = ({
  showAbout,
  showSettings,
  showBookmarks,
  showHistory,
  showDownloads,
  showDocumentation,
  showExtensions,
}: AppMenuProps) => {
  const { t } = useTranslation();

  return (
    <div
      id="AppMenu__container"
      className="AppMenu__container"
      data-testid="app-menu"
    >
      <ul>
        <li onClick={() => window.app.tools.toggleDarkMode()}>
          {t('Toggle dark mode')}
        </li>
        <li onClick={() => showExtensions()}>{t('Extensions')}</li>
        <li onClick={() => showDownloads()}>{t('Downloads')}</li>
        <li onClick={() => showBookmarks()}>{t('Bookmarks')}</li>
        <li onClick={() => showHistory()}>{t('History')}</li>
        <li onClick={() => showSettings()}>{t('Settings')}</li>
        <li onClick={() => showDocumentation()}>{t('Documentation')}</li>
        <li onClick={() => showAbout()}>{t('About')}</li>
      </ul>
    </div>
  );
};
