/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ApplicationSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [appSettingLaunch, setAppSettingLaunch] = useState<boolean>(false);

  const updateAppSettingLaunch = (value: boolean) => {
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
          onChange={(e) => updateAppSettingLaunch(e.target.checked)}
        />
        <label htmlFor="application-settings-launch-at-startup">
          {t('Launch at startup')}
        </label>
        <div className="Settings__item-description">
          {t('If checked, the app will auto-launch at system startup.')}
        </div>
      </div>
      <div className="Settings__item">
        <label htmlFor="application-settings-language">{t('Language')}:</label>
        <select
          id="application-settings-language"
          value={i18n.language}
          onChange={(e) => updateLanguage(e.target.value)}
        >
          <option value="en">{t('English')}</option>
          <option value="es">{t('Spanish')}</option>
          <option value="fr">{t('French')}</option>
          <option value="de">{t('German')}</option>
          <option value="ru">{t('Russian')}</option>
          <option value="fa">{t('Persian')}</option>
          <option value="tr">{t('Turkish')}</option>
          <option value="cn">{t('Chinese')}</option>
          <option value="ar">{t('Arabic')}</option>
          <option value="nl">{t('Dutch')}</option>
          <option value="pl">{t('Polish')}</option>
          <option value="pt">{t('Portuguese')}</option>
          <option value="ja">{t('Japanese')}</option>
        </select>
        <div className="Settings__item-description">
          {t('The language in which displays the application.')}
        </div>
      </div>
    </>
  );
};
