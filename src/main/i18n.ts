import i18n from 'i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import ar from './locales/ar.json';
import cn from './locales/cn.json';
import pt from './locales/pt.json';
import tr from './locales/tr.json';
import de from './locales/de.json';
import fa from './locales/fa.json';
import ja from './locales/ja.json';

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
  pt: {
    translation: pt,
  },
  tr: {
    translation: tr,
  },
  de: {
    translation: de,
  },
  fa: {
    translation: fa,
  },
  ja: {
    translation: ja,
  },
};

i18n.init({
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
