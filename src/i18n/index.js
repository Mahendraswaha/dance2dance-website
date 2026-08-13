import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dicionários
import pt from './locales/pt.json';
import en from './locales/en.json';
import no from './locales/no.json';

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  no: { translation: no }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false // o React já faz o escape por padrão
    }
  });

export default i18n;
