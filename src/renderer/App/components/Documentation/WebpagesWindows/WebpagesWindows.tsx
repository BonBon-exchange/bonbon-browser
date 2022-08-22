/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const WebpagesWindows: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.app.analytics.page('/documentation/webpagesWindows');
  }, []);

  return (
    <>
      <h2 data-testid="documentation-webpages-page">{t('Webpages windows')}</h2>
      <div className="Documentation__item">
        <div className="Documentation__item-title">
          Distribute webpages windows evenly
        </div>
        <div className="Documentation__item-description">
          {t(
            'Right click on the background document (not on a webpage), and select "Distribute windows evenly".'
          )}
        </div>
      </div>
    </>
  );
};
