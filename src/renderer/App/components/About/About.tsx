/* eslint-disable import/prefer-default-export */
import { useTranslation } from 'react-i18next';

export const About: React.FC = () => {
  const { t } = useTranslation();
  const appVersion = localStorage.getItem('appVersion');
  return (
    <>
      <div>
        {t('App version')}: {appVersion}
      </div>
      <div>{t('Author')}: Daniel Febrero</div>
      <div>{t('Co-Author')}: Aitor</div>
    </>
  );
};
