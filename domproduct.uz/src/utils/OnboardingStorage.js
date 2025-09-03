// LocalStorage bilan onboarding holatini boshqarish uchun utility functions

const ONBOARDING_KEY = 'dpl_onboarding_completed';
const ONBOARDING_VERSION_KEY = 'dpl_onboarding_version';
const CURRENT_VERSION = '1.0';

export const OnboardingStorage = {
  // Onboarding yakunlanganligini tekshirish
  isCompleted: () => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    const version = localStorage.getItem(ONBOARDING_VERSION_KEY);
    
    // Agar version mos kelmasa yoki completed yo'q bo'lsa, qayta ko'rsatish kerak
    return completed === 'true' && version === CURRENT_VERSION;
  },

  // Onboarding yakunlanganligini belgilash
  setCompleted: () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(ONBOARDING_VERSION_KEY, CURRENT_VERSION);
  },

  // Onboarding holatini tozalash (test uchun)
  reset: () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(ONBOARDING_VERSION_KEY);
  },

  // Joriy versiyani olish
  getCurrentVersion: () => CURRENT_VERSION,

  // Onboarding versiyasini tekshirish
  checkVersion: () => {
    const version = localStorage.getItem(ONBOARDING_VERSION_KEY);
    return version === CURRENT_VERSION;
  }
};
