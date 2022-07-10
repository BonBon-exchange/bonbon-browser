/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import './style.scss';

export const BrowsingSettings: React.FC = () => {
  const { t } = useTranslation();
  const [browsingSettingDefaultWebpage, setBrowsingSettingDefaultWebpage] =
    useState<string | undefined>('');

  const [
    browsingSettingDefaultSearchEngine,
    setBrowsingSettingDefaultSearchEngine,
  ] = useState<string | undefined>('');

  const [browsingSettingDefaultWidth, setBrowsingSettingDefaultWidth] =
    useState<number | undefined>(0);

  const [browsingSettingDefaultHeight, setBrowsingSettingDefaultHeight] =
    useState<number | undefined>(0);

  const searchEngines = [
    'Google',
    'Presearch',
    'Qwant',
    'DuckDuckGo',
    'Yandex',
    'Swisscows',
    'Ecosia',
    'StartPage',
  ];

  const updateBrowsingSettingWebpage = (value: string) => {
    setBrowsingSettingDefaultWebpage(value);
    window.app.config.set({
      key: 'browsing.defaultWebpage',
      value,
    });
  };

  const updateBrowsingSettingSeachEngine = (value: string) => {
    setBrowsingSettingDefaultSearchEngine(value);
    window.app.config.set({
      key: 'browsing.searchEngine',
      value,
    });
  };

  const updateBrowsingSettingWidth = (value: number) => {
    setBrowsingSettingDefaultWidth(value);
    window.app.config.set({
      key: 'browsing.width',
      value,
    });
  };

  const updateBrowsingSettingHeight = (value: number) => {
    setBrowsingSettingDefaultHeight(value);
    window.app.config.set({
      key: 'browsing.height',
      value,
    });
  };

  useEffect(() => {
    window.app.config.get('browsing.defaultWebpage').then((val: unknown) => {
      const typedVal = val as string | undefined;
      setBrowsingSettingDefaultWebpage(typedVal);
    });

    window.app.config.get('browsing.searchEngine').then((val: unknown) => {
      const typedVal = val as string | undefined;
      setBrowsingSettingDefaultSearchEngine(typedVal);
    });

    window.app.config.get('browsing.width').then((val: unknown) => {
      const typedVal = val as number | undefined;
      setBrowsingSettingDefaultWidth(typedVal);
    });

    window.app.config.get('browsing.height').then((val: unknown) => {
      const typedVal = val as number | undefined;
      setBrowsingSettingDefaultHeight(typedVal);
    });
  }, []);

  return (
    <>
      <h2>{t('Browsing')}</h2>
      <div className="Settings__item">
        <label htmlFor="browsing-settings-default-webpage">
          {t('New windows default webpage')}:
        </label>
        <input
          type="text"
          id="browsing-settings-default-webpage"
          value={browsingSettingDefaultWebpage}
          onChange={(e) => updateBrowsingSettingWebpage(e.target.value)}
        />
        <div className="Settings__item-description">
          {t('The url that will open first when opening a new window.')}
        </div>
      </div>
      <div className="Settings__item">
        <label htmlFor="browsing-settings-default-search-engine">
          {t('Default search engine')}:
        </label>
        <select
          id="browsing-settings-default-search-engine"
          onChange={(e) => updateBrowsingSettingSeachEngine(e.target.value)}
          value={browsingSettingDefaultSearchEngine}
        >
          {searchEngines.map((se) => {
            return <option value={se.toLocaleLowerCase()}>{se}</option>;
          })}
        </select>
        <div className="Settings__item-description">
          {t(
            'The search engine that will be used when entering text in the url input and pressing enter.'
          )}
        </div>
      </div>
      <div className="Settings__item">
        <label htmlFor="browsing-settings-default-width">
          {t('New windows default size')}:
        </label>
        <input
          type="number"
          id="browsing-settings-default-width"
          value={browsingSettingDefaultWidth}
          onChange={(e) => updateBrowsingSettingWidth(Number(e.target.value))}
        />
        x
        <input
          type="number"
          id="browsing-settings-default-height"
          value={browsingSettingDefaultHeight}
          onChange={(e) => updateBrowsingSettingHeight(Number(e.target.value))}
        />
        <div className="Settings__item-description">
          {t('The size of opening new windows when they are not maximized.')}
        </div>
      </div>
    </>
  );
};
