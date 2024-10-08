/* eslint-disable import/prefer-default-export */
import { useTranslation } from 'react-i18next';

import packagejson from '../../../../../package.json';

import './style.scss';

export const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="About__property-line">
        <span className="About__property">{t('App version')}:</span>{' '}
        {packagejson.version}
      </div>
      <div className="About__property-line">
        <span className="About__property">{t('Author')}:</span> Daniel Febrero
      </div>
    </>
  );
};
