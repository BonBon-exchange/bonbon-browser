/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { CloseButton } from 'renderer/App/components/CloseButton';
import { ApplicationSettings } from './ApplicationSettings';
import { BrowsingSettings } from './BrowsingSettings';
import { ExtensionsSettings } from './ExtensionsSettings';

import './style.scss';
import { SettingsProps } from './Types';

export const Settings: React.FC<SettingsProps> = ({
  handleClose,
}: SettingsProps) => {
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<ReactElement>(
    <ApplicationSettings />
  );

  return (
    <div id="Settings__container">
      <CloseButton handleClose={handleClose} />
      <div id="Settings__left-panel">
        <h2>{t('Settings')}</h2>
        <ul>
          <li onClick={() => setSelectedView(<ApplicationSettings />)}>
            {t('Application')}
          </li>
          <li
            onClick={() => setSelectedView(<BrowsingSettings />)}
            data-testid="settings-browsing-link"
          >
            {t('Browsing')}
          </li>
          <li
            onClick={() => setSelectedView(<ExtensionsSettings />)}
            data-testid="settings-extensions-link"
          >
            {t('Extensions')}
          </li>
        </ul>
      </div>
      <div id="Settings__right-panel">{selectedView}</div>
    </div>
  );
};
