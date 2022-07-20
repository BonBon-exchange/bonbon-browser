import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from 'renderer/App/locales/en.json';
import es from 'renderer/App/locales/es.json';
import fr from 'renderer/App/locales/fr.json';
import nl from 'renderer/App/locales/nl.json';
import pl from 'renderer/App/locales/pl.json';
import ru from 'renderer/App/locales/ru.json';
import ar from 'renderer/App/locales/ar.json';

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
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
