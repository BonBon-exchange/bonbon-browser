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

  const udpateAppSettingLaunch = (value: string) => {
    setBrowsingSettingDefaultWebpage(value);
    window.app.store.set({
      key: 'defaultWebpage',
      value,
    });
  };

  useEffect(() => {
    window.app.store.get('defaultWebpage').then((val: unknown) => {
      const typedVal = val as string | undefined;
      setBrowsingSettingDefaultWebpage(typedVal);
    });
  }, []);

  return (
    <>
      <h2>Application</h2>
      <div className="Settings__item">
        <label htmlFor="browsing-settings-default-webpage">
          New windows default webpage:
        </label>
        <input
          type="text"
          id="browsing-settings-default-webpage"
          value={browsingSettingDefaultWebpage}
          onChange={(e) => udpateAppSettingLaunch(e.target.value)}
        />
        <div className="Settings__item-description">
          The url that will open first when opening a new window.
        </div>
      </div>
    </>
  );
};
