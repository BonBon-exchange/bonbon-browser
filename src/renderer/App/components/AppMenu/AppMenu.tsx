/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useTranslation } from 'react-i18next';

import { AppMenuProps } from './Types';

export const AppMenu = ({
  showAbout,
  showSettings,
  showBookmarks,
  showHistory,
  showDownloads,
  showDocumentation,
  showExtensions,
  showBoards,
}: AppMenuProps) => {
  const { t } = useTranslation();

  return (
    <div
      id="AppMenu__container"
      className="fixed right-0 top-0 bg-background-tertiary w-[200px] text-text-primary z-[100]"
      data-testid="app-menu"
    >
      <ul className="list-none p-0 m-0">
        <li
          className="p-[13px] cursor-pointer hover:bg-background-5"
          onClick={() => window.app.tools.toggleDarkMode()}
        >
          {t('Toggle dark mode')}
        </li>
        <li
          className="p-[13px] border-t border-text-primary cursor-pointer hover:bg-background-5"
          onClick={() => showBoards()}
        >
          {t('Boards')}
        </li>
        <li
          className="p-[13px] border-t border-text-primary cursor-pointer hover:bg-background-5"
          onClick={() => showExtensions()}
        >
          {t('Extensions')}
        </li>
        <li
          className="p-[13px] border-t border-text-primary cursor-pointer hover:bg-background-5"
          onClick={() => showDownloads()}
        >
          {t('Downloads')}
        </li>
        <li
          className="p-[13px] border-t border-text-primary cursor-pointer hover:bg-background-5"
          onClick={() => showBookmarks()}
        >
          {t('Bookmarks')}
        </li>
        <li
          className="p-[13px] border-t border-text-primary cursor-pointer hover:bg-background-5"
          onClick={() => showHistory()}
        >
          {t('History')}
        </li>
        <li
          className="p-[13px] border-t border-text-primary cursor-pointer hover:bg-background-5"
          onClick={() => showSettings()}
        >
          {t('Settings')}
        </li>
        <li
          className="p-[13px] border-t border-text-primary cursor-pointer hover:bg-background-5"
          onClick={() => showDocumentation()}
        >
          {t('Documentation')}
        </li>
        <li
          className="p-[13px] border-t border-text-primary cursor-pointer hover:bg-background-5"
          onClick={() => showAbout()}
        >
          {t('About')}
        </li>
      </ul>
    </div>
  );
};
