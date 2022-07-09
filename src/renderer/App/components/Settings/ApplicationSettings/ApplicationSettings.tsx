/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';

export const ApplicationSettings: React.FC = () => {
  const [appSettingLaunch, setAppSettingLaunch] = useState<boolean>(false);

  const udpateAppSettingLaunch = (value: boolean) => {
    setAppSettingLaunch(value);
    window.app.store.set({
      key: 'application.launchAtStartup',
      value,
    });
  };

  useEffect(() => {
    window.app.store
      .get('application.launchAtStartup')
      .then((val: unknown) => setAppSettingLaunch(Boolean(val)));
  }, []);

  return (
    <>
      <h2>Application</h2>
      <div className="Settings__item">
        <input
          type="checkbox"
          id="application-settings-launch-at-startup"
          checked={appSettingLaunch}
          onChange={(e) => udpateAppSettingLaunch(e.target.checked)}
          disabled
        />
        <label htmlFor="application-settings-launch-at-startup">
          Launch at startup
        </label>
        <div className="Settings__item-description">
          This feature is not available yet.
        </div>
      </div>
    </>
  );
};
