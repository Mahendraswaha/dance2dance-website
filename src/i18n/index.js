import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // idioma padrão
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // o React já faz o escape por padrão
    }
  });

export default i18n;
