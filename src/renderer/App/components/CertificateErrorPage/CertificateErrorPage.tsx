/* eslint-disable import/prefer-default-export */
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'renderer/App/store/hooks';
import { updateBrowserCertificateErrorFingerprint } from 'renderer/App/store/reducers/Board';

import './style.scss';

import { CertificateErrorPageProps } from './Types';

export const CertificateErrorPage: React.FC<CertificateErrorPageProps> = ({
  webContentsId,
  browserId,
  fingerprint,
  reload,
}: CertificateErrorPageProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleContinue = () => {
    console.log(webContentsId, fingerprint);
    window.app.browser.certificateErrorAnswer({
      webContentsId,
      fingerprint,
      isTrusted: true,
    });

    dispatch(
      updateBrowserCertificateErrorFingerprint({
        browserId,
        certificateErrorFingerprint: null,
      })
    );

    reload();
  };

  return (
    <div className="CertificateErrorPage__container">
      <div className="CertificateErrorPage__message">
        {t(
          'The certificate for this page is incorrect. Visiting the website could be dangerous.'
        )}
      </div>
      <div className="CertificateErrorPage__button">
        <Button variant="contained" onClick={handleContinue}>
          {t('Continue')}
        </Button>
      </div>
    </div>
  );
};
