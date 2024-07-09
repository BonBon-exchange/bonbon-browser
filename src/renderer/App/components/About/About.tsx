/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import packagejson from '../../../../../package.json';

import './style.scss';

export const About = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.app.analytics.page('/about');
  }, []);

  return (
    <>
      <div className="About__property-line">
        <span className="About__property">{t('App version')}:</span>{' '}
        {packagejson.version}
      </div>
      <div className="About__property-line">
        <span className="About__property">{t('Author')}:</span> Daniel Febrero
      </div>
      <div className="About__property-line">
        <span className="About__property">{t('Team')}:</span> Daniel Febrero,
        Anthony Cettour, 0xCUBE, Nuklusone, Howard Huang, Faouzi Benali, Daniel
        Callus
      </div>
      <div className="About__property-line">
        <span className="About__property">{t('Past contributors')}:</span> Aitor
      </div>
    </>
  );
};
