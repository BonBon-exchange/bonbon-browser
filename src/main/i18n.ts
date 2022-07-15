import i18n from 'i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  nl: {
    translation: nl,
  },
  pl: {
    translation: pl,
  },
};

i18n.init({
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
