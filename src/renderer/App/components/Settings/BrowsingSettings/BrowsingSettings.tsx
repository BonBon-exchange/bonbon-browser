/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from 'renderer/App/hooks/useSettings';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { setSetting } from 'renderer/App/store/reducers/Settings';
import './style.scss';

export const BrowsingSettings = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  const dispatch = useAppDispatch();

  const [browsingSettingDefaultWebpage, setBrowsingSettingDefaultWebpage] =
    useState<string | undefined>(settings['browsing.defaultWebpage']);

  const [
    browsingSettingDefaultSearchEngine,
    setBrowsingSettingDefaultSearchEngine,
  ] = useState<string | undefined>(settings['browsing.searchEngine']);

  const [browsingSettingDefaultWidth, setBrowsingSettingDefaultWidth] =
    useState<number | undefined>(settings['browsing.width']);

  const [browsingSettingDefaultHeight, setBrowsingSettingDefaultHeight] =
    useState<number | undefined>(settings['browsing.height']);

  const [browsingSettingDefaultSize, setBrowsingSettingDefaultSize] = useState<
    string | undefined
  >(settings['browsing.size']);

  const [browsingSettingDontSaveHistory, setBrowsingSettingDontSaveHistory] =
    useState<boolean | undefined>(settings['browsing.dontSaveHistory']);

  const [browsingSettingTopEdge, setBrowsingSettingTopEdge] = useState<
    string | undefined
  >(settings['browsing.topEdge']);

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

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'browsing.defaultWebpage',
        value: browsingSettingDefaultWebpage,
      })
    );
  }, [browsingSettingDefaultWebpage, dispatch]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'browsing.searchEngine',
        value: browsingSettingDefaultSearchEngine,
      })
    );
  }, [browsingSettingDefaultSearchEngine, dispatch]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'browsing.width',
        value: browsingSettingDefaultWidth,
      })
    );
  }, [browsingSettingDefaultWidth, dispatch]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'browsing.height',
        value: browsingSettingDefaultHeight,
      })
    );
  }, [browsingSettingDefaultHeight, dispatch]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'browsing.size',
        value: browsingSettingDefaultSize,
      })
    );
  }, [browsingSettingDefaultSize, dispatch]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'browsing.dontSaveHistory',
        value: browsingSettingDontSaveHistory,
      })
    );
  }, [browsingSettingDontSaveHistory, dispatch]);

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'browsing.topEdge',
        value: browsingSettingTopEdge,
      })
    );
  }, [browsingSettingTopEdge, dispatch]);

  return (
    <>
      <h2>{t('Browsing')}</h2>
      <div className="Settings__item" data-testid="settings-browsing-page">
        <label htmlFor="browsing-settings-default-webpage">
          {t('New windows default webpage')}:
        </label>
        <input
          type="text"
          id="browsing-settings-default-webpage"
          value={browsingSettingDefaultWebpage}
          onChange={(e) => setBrowsingSettingDefaultWebpage(e.target.value)}
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
          onChange={(e) =>
            setBrowsingSettingDefaultSearchEngine(e.target.value)
          }
          value={browsingSettingDefaultSearchEngine}
        >
          {searchEngines.map((se) => {
            return (
              <option
                value={se.toLocaleLowerCase()}
                key={se.toLocaleLowerCase()}
              >
                {se}
              </option>
            );
          })}
        </select>
        <div className="Settings__item-description">
          {t(
            'The search engine that will be used when entering text in the url input and pressing enter.'
          )}
        </div>
      </div>
      <div className="Settings__item">
        <div className="Settings__item-title">
          {t('New webpages default size')}
        </div>
        <input
          type="radio"
          value="defined"
          checked={browsingSettingDefaultSize === 'defined'}
          name="browsing-settings-default-size"
          onChange={(e) => setBrowsingSettingDefaultSize(e.target.value)}
          id="browsing-settings-default-size-defined"
        />
        <label htmlFor="browsing-settings-default-size-defined">
          {t('As defined here')}:
        </label>
        <input
          type="number"
          id="browsing-settings-default-width"
          value={browsingSettingDefaultWidth}
          onChange={(e) =>
            setBrowsingSettingDefaultWidth(Number(e.target.value))
          }
        />
        x
        <input
          type="number"
          id="browsing-settings-default-height"
          value={browsingSettingDefaultHeight}
          onChange={(e) =>
            setBrowsingSettingDefaultHeight(Number(e.target.value))
          }
        />
        <br />
        <input
          type="radio"
          value="lastClosed"
          checked={browsingSettingDefaultSize === 'lastClosed'}
          onChange={(e) => setBrowsingSettingDefaultSize(e.target.value)}
          name="browsing-settings-default-size"
          id="browsing-settings-default-size-last-closed"
        />
        <label htmlFor="browsing-settings-default-size-last-closed">
          {t('Use the size of the last closed webpage')}
        </label>
        <br />
        <input
          type="radio"
          value="lastResized"
          checked={browsingSettingDefaultSize === 'lastResized'}
          onChange={(e) => setBrowsingSettingDefaultSize(e.target.value)}
          name="browsing-settings-default-size"
          id="browsing-settings-default-size-last-resized"
        />
        <label htmlFor="browsing-settings-default-size-last-resized">
          {t('Use the size of the last resized window')}
        </label>
        <div className="Settings__item-description">
          {t('The size of opening new windows when they are not maximized.')}
        </div>
      </div>
      <div className="Settings__item">
        <input
          type="checkbox"
          id="browsing-settings-dont-save-history"
          checked={browsingSettingDontSaveHistory}
          onChange={(e) => setBrowsingSettingDontSaveHistory(e.target.checked)}
        />
        <label htmlFor="browsing-settings-dont-save-history">
          {t('Do not save browsing history')}
        </label>
        <div className="Settings__item-description">
          {t(
            'If checked, BonBon will not save your browsing history. It will also disable URL suggestions.'
          )}
        </div>
      </div>
      <div className="Settings__item">
        <div className="Settings__item-title">
          {t('When dragging a window to the top edge')}:
        </div>
        <input
          type="radio"
          value="maximize"
          checked={browsingSettingTopEdge === 'maximize'}
          name="browsing-settings-top-edge"
          onChange={(e) => setBrowsingSettingTopEdge(e.target.value)}
          id="browsing-settings-top-edge-maximize"
        />
        <label htmlFor="browsing-settings-top-edge-maximize">
          {t('Maximize')}
        </label>
        <br />
        <input
          type="radio"
          value="fit"
          checked={browsingSettingTopEdge === 'fit'}
          onChange={(e) => setBrowsingSettingTopEdge(e.target.value)}
          name="browsing-settings-top-edge"
          id="browsing-settings-top-edge-fit"
        />
        <label htmlFor="browsing-settings-top-edge-fit">
          {t('Fit the screen')}
        </label>
        <div className="Settings__item-description">
          {t(
            'Maximize the window or enlarge the window when dragging it to the top edge.'
          )}
        </div>
      </div>
    </>
  );
};
