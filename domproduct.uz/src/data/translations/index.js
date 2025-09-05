// Import individual language translation files
import { uzTranslations } from './uz.js';
import { ruTranslations } from './ru.js';
import { enTranslations } from './en.js';

// Combine all translations into the resources object
export const resources = {
  uz: {
    translation: uzTranslations
  },
  ru: {
    translation: ruTranslations
  },
  en: {
    translation: enTranslations
  }
};
