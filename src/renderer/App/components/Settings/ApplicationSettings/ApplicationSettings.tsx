/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const ApplicationSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [appSettingLaunch, setAppSettingLaunch] = useState<boolean>(false);

  const udpateAppSettingLaunch = (value: boolean) => {
    setAppSettingLaunch(value);
    window.app.config.set({
      key: 'application.launchAtStartup',
      value,
    });
  };

  const updateLanguage = (value: string) => {
    i18n.changeLanguage(value);
    window.app.tools.changeLanguage(value);
  };

  useEffect(() => {
    window.app.config
      .get('application.launchAtStartup')
      .then((val: unknown) => setAppSettingLaunch(Boolean(val)));
  }, []);

  return (
    <>
      <h2>{t('Application')}</h2>
      <div className="Settings__item">
        <input
          type="checkbox"
          id="application-settings-launch-at-startup"
          checked={appSettingLaunch}
          onChange={(e) => udpateAppSettingLaunch(e.target.checked)}
          disabled
        />
        <label htmlFor="application-settings-launch-at-startup">
          {t('Launch at startup')}
        </label>
        <div className="Settings__item-description">
          {t('This feature is not available yet.')}
        </div>
      </div>
      <div className="Settings__item">
        <label htmlFor="application-settigns-language">{t('Language')}:</label>
        <select
          id="application-settigns-language"
          value={i18n.language}
          onChange={(e) => updateLanguage(e.target.value)}
        >
          <option value="en">{t('English')}</option>
          <option value="es">{t('Spanish')}</option>
          <option value="fr">{t('French')}</option>
        </select>
        <div className="Settings__item-description">
          {t('The language in which display the application.')}
        </div>
      </div>
    </>
  );
};
