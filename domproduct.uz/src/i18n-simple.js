import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './data/translations';

// i18next ni initialize qilish
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('selectedLanguage') || 'uz', // default language
    fallbackLng: 'uz',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already does escaping
    },
    react: {
      useSuspense: false // disable suspense for now
    }
  });

export default i18n;
