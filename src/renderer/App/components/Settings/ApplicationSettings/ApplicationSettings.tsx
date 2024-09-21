/* eslint-disable promise/catch-or-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from 'renderer/App/hooks/useSettings';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { setSetting } from 'renderer/App/store/reducers/Settings';

import { Locale } from 'types/i18n';

export const ApplicationSettings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const [appSettingLaunch, setAppSettingLaunch] = useState<boolean>(
    settings['application.launchAtStartup']
  );
  const [appSettingBackgroundColor1, setAppSettingBackgroundColor1] =
    useState<string>(settings['application.backgroundGradientColors.0']);
  const [appSettingBackgroundColor2, setAppSettingBackgroundColor2] =
    useState<string>(settings['application.backgroundGradientColors.1']);
  const [appSettingBackgroundColor3, setAppSettingBackgroundColor3] =
    useState<string>(settings['application.backgroundGradientColors.2']);
  const [appSettingMinimapTimeout, setAppSettingMinimapTimeout] =
    useState<number>(settings['application.minimapTimeout']);
  const [appSettingMinimapOn, setAppSettingMinimapOn] = useState<boolean>(
    settings['application.minimapOn']
  );

  const updateLanguage = (value: Locale) => {
    i18n.changeLanguage(value).catch(console.log);
    window.app.tools.changeLanguage(value).catch(console.log);
  };

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'application.launchAtStartup',
        value: appSettingLaunch,
      })
    );
  }, [appSettingLaunch, dispatch]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'application.backgroundGradientColors',
        value: [
          appSettingBackgroundColor1,
          appSettingBackgroundColor2,
          appSettingBackgroundColor3,
        ],
      })
    );
  }, [
    appSettingBackgroundColor1,
    appSettingBackgroundColor2,
    appSettingBackgroundColor3,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'application.minimapTimeout',
        value: appSettingMinimapTimeout,
      })
    );
  }, [appSettingMinimapTimeout, dispatch]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'application.minimapOn',
        value: appSettingMinimapOn,
      })
    );
  }, [appSettingMinimapOn, dispatch]);

  return (
    <>
      <h2>{t('Application')}</h2>
      <div className="Settings__item">
        <input
          type="checkbox"
          id="application-settings-launch-at-startup"
          checked={appSettingLaunch}
          onChange={(e) => setAppSettingLaunch(e.target.checked)}
        />
        <label htmlFor="application-settings-launch-at-startup">
          {t('Launch at startup')}
        </label>
        <div className="Settings__item-description">
          {t('If checked, the app will auto-launch at system startup.')}
        </div>
      </div>
      <div className="Settings__item">
        <div>
          <input
            type="text"
            id="application-settings-background-color-1"
            value={appSettingBackgroundColor1}
            onChange={(e) => setAppSettingBackgroundColor1(e.target.value)}
          />
          <label htmlFor="application-settings-launch-at-startup">
            {t('Background color 1')}
          </label>
        </div>
        <div>
          <input
            type="text"
            id="application-settings-background-color-3"
            value={appSettingBackgroundColor2}
            onChange={(e) => setAppSettingBackgroundColor2(e.target.value)}
          />
          <label htmlFor="application-settings-launch-at-startup">
            {t('Background color 2')}
          </label>
        </div>
        <div>
          <input
            type="text"
            id="application-settings-background-color-2"
            value={appSettingBackgroundColor3}
            onChange={(e) => setAppSettingBackgroundColor3(e.target.value)}
          />
          <label htmlFor="application-settings-launch-at-startup">
            {t('Background color 3')}
          </label>
        </div>
        <div className="Settings__item-description">
          {t('Change the background gradient colors.')}
        </div>
      </div>
      <div className="Settings__item">
        <label htmlFor="application-settings-language">{t('Language')}:</label>
        <select
          id="application-settings-language"
          value={i18n.language}
          onChange={(e) => updateLanguage(e.target.value as Locale)}
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
      <div className="Settings__item">
        <input
          type="number"
          id="application-settings-minimap-timeout"
          value={appSettingMinimapTimeout}
          onChange={(e) => setAppSettingMinimapTimeout(Number(e.target.value))}
        />
        <label htmlFor="application-settings-launch-at-startup">
          {t('ms before minimap disapearing')}
        </label>
        <div className="Settings__item-description">
          {t(
            'The timeout before minimap disapearing of the screen when the mouse leave the detection zone.'
          )}
        </div>
      </div>
      <div className="Settings__item">
        <input
          type="checkbox"
          id="application-settings-minimap-always-on"
          checked={appSettingMinimapOn}
          onChange={(e) => setAppSettingMinimapOn(e.target.checked)}
        />
        <label htmlFor="application-settings-minimap-always-on">
          {t('Minimap always visible')}
        </label>
        <div className="Settings__item-description">
          {t(
            'If checked, the minimap on the right side will always be visible.'
          )}
        </div>
      </div>
    </>
  );
};
