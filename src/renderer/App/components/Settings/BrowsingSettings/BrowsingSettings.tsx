/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';

import './style.scss';

export const BrowsingSettings: React.FC = () => {
  const [browsingSettingDefaultWebpage, setBrowsingSettingDefaultWebpage] =
    useState<string | undefined>('');

  const [
    browsingSettingDefaultSearchEngine,
    setBrowsingSettingDefaultSearchEngine,
  ] = useState<string | undefined>('');

  const searchEngines = [
    'Google',
    'Presearch',
    'Qwant',
    'DuckDuckGo',
    'Yandex',
    'Swisscows',
    'Ecosia',
  ];

  const updateBrowsingSettingLaunch = (value: string) => {
    setBrowsingSettingDefaultWebpage(value);
    window.app.store.set({
      key: 'browsing.defaultWebpage',
      value,
    });
  };

  const updateBrowsingSettingSeachEngine = (value: string) => {
    setBrowsingSettingDefaultSearchEngine(value);
    window.app.store.set({
      key: 'browsing.searchEngine',
      value,
    });
  };

  useEffect(() => {
    window.app.store.get('browsing.defaultWebpage').then((val: unknown) => {
      const typedVal = val as string | undefined;
      setBrowsingSettingDefaultWebpage(typedVal);
    });

    window.app.store.get('browsing.searchEngine').then((val: unknown) => {
      const typedVal = val as string | undefined;
      setBrowsingSettingDefaultSearchEngine(typedVal);
    });
  }, []);

  return (
    <>
      <h2>Browsing</h2>
      <div className="Settings__item">
        <label htmlFor="browsing-settings-default-webpage">
          New windows default webpage:
        </label>
        <input
          type="text"
          id="browsing-settings-default-webpage"
          value={browsingSettingDefaultWebpage}
          onChange={(e) => updateBrowsingSettingLaunch(e.target.value)}
        />
        <div className="Settings__item-description">
          The url that will open first when opening a new window.
        </div>
      </div>
      <div className="Settings__item">
        <label htmlFor="browsing-settings-default-search-engine">
          Default search engine:
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
          The search engine that will be used when entering text in the url
          input and pressing enter.
        </div>
      </div>
    </>
  );
};
