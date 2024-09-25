/* eslint-disable import/prefer-default-export */
import { useTranslation } from 'react-i18next';
import packagejson from '../../../../../package.json';

export const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-1.5">
        <span className="font-bold">{t('App version')}:</span>{' '}
        {packagejson.version}
      </div>
      <div className="mb-1.5">
        <span className="font-bold">{t('Author')}:</span> Daniel Febrero
      </div>
    </>
  );
};
