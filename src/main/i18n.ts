import i18n from 'i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import ar from './locales/ar.json';
import cn from './locales/cn.json';

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
  ru: {
    translation: ru,
  },
  ar: {
    translation: ar,
  },
  cn: {
    translation: cn,
  },
};

i18n.init({
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
