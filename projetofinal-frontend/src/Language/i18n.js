// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import useUserStore from '../Stores/UserStore';

// Importar os recursos de tradução
import translationEN from '../Locales/en/translation.json';
import translationPT from '../Locales/pt/translation.json';

// Os recursos de tradução
const resources = {
  en: {
    translation: translationEN,
  },
  pt: {
    translation: translationPT,
  },
};
function getLanguage() {
  const savedLanguage =  useUserStore.getState().language;
  return savedLanguage;
}

const savedLanguage = getLanguage();


i18n
  .use(initReactI18next) // Passa o i18n para o react-i18next.
  .init({
    resources,
    lng: savedLanguage, // Idioma padrão
    fallbackLng: 'en', // Quando o idioma especificado não está disponível
    interpolation: {
      escapeValue: false, // Não é necessário para React, pois ele já escapa valores por padrão
    },
  });

export default i18n;