import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './data/translations'; // Fallback tarjimalar

// API orqali tarjimalarni yuklash funksiyasi
const loadTranslationsFromAPI = async (languageCode) => {
  try {
    const response = await fetch(`/api/v1/translations/${languageCode}`);
    const result = await response.json();
    
    if (result.success && result.translations) {
      return {
        [languageCode]: {
          translation: result.translations
        }
      };
    }
    return null;
  } catch (error) {
    console.error(`${languageCode} tilini yuklashda xatolik:`, error);
    return null;
  }
};

// Barcha faol tillarning tarjimalarini yuklash
const loadAllTranslations = async () => {
  try {
    // Avval tilllar ro'yxatini olish
    const languagesResponse = await fetch('/api/v1/languages');
    const languagesResult = await languagesResponse.json();
    
    if (languagesResult.success && languagesResult.data) {
      const activeLanguages = languagesResult.data.filter(lang => lang.is_active);
      const translationsPromises = activeLanguages.map(lang => 
        loadTranslationsFromAPI(lang.code)
      );
      
      const translationsResults = await Promise.all(translationsPromises);
      
      // API dan kelgan tarjimalarni birlashtirish
      const apiResources = {};
      translationsResults.forEach(result => {
        if (result) {
          Object.assign(apiResources, result);
        }
      });
      
      // Fallback bilan birlashtirish
      const combinedResources = { ...resources };
      Object.keys(apiResources).forEach(lang => {
        if (combinedResources[lang]) {
          // API tarjimasini fallback ustiga qo'yish
          combinedResources[lang].translation = {
            ...combinedResources[lang].translation,
            ...apiResources[lang].translation
          };
        } else {
          // Yangi til qo'shish
          combinedResources[lang] = apiResources[lang];
        }
      });
      
      return combinedResources;
    }
    
    // Agar API ishlamasa, fallback qaytarish
    return resources;
  } catch (error) {
    console.error('Tarjimalarni yuklashda xatolik:', error);
    return resources;
  }
};

// i18next-ni sozlash
const initializeI18n = async () => {
  const translationResources = await loadAllTranslations();
  
  i18n
    .use(initReactI18next)
    .init({
      resources: translationResources,
      lng: localStorage.getItem('selectedLanguage') || 'uz', // Saqlangan tilni yuklash
      fallbackLng: 'uz',

      interpolation: {
        escapeValue: false, // react already safes from xss
      },

      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
};

// i18n-ni darhol sozlash
initializeI18n();

// Tarjimalarni qayta yuklash funksiyasi (til o'zgarganda chaqiriladi)
export const reloadTranslations = async (languageCode) => {
  const newTranslations = await loadTranslationsFromAPI(languageCode);
  if (newTranslations && newTranslations[languageCode]) {
    i18n.addResourceBundle(
      languageCode, 
      'translation', 
      newTranslations[languageCode].translation, 
      true, // override existing translations
      true  // merge with existing namespace
    );
  }
};

export default i18n;
