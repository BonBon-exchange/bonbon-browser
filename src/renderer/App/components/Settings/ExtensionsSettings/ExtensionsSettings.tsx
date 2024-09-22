/* eslint-disable promise/catch-or-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'renderer/App/store/hooks';
import { setSetting } from 'renderer/App/store/reducers/Settings';
import { useSettings } from 'renderer/App/hooks/useSettings';

export const ExtensionsSettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const [extForceUBlock, setForceUBlock] = useState<boolean>(
    settings['extensions.forceInstallUBlockOrigin']
  );

  useEffect(() => {
    dispatch(
      setSetting({
        key: 'extensions.forceInstallUBlockOrigin',
        value: extForceUBlock,
      })
    );
  }, [dispatch, extForceUBlock]);

  return (
    <>
      <h2>{t('Extensions')}</h2>
      <div className="Settings__item" data-testid="settings-extensions-page">
        <input
          type="checkbox"
          id="extensions-force-install-u-block"
          checked={extForceUBlock}
          onChange={(e) => setForceUBlock(e.target.checked)}
        />
        <label htmlFor="extensions-force-install-u-block">
          {t('Force uBlockOrigin installation at startup')}
        </label>
        <div className="Settings__item-description">
          {t(
            'If checked, the app will automatically download uBlockOrigin and install it when starting.'
          )}
        </div>
      </div>
    </>
  );
};
