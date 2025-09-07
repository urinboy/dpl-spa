/**
 * Утилита функциялари
 */

/**
 * Санани форматлаш
 * @param {string|Date} date - Сана
 * @param {string} locale - Локал (default: 'uz-UZ')
 * @returns {string} Форматланган сана
 */
export const formatDate = (date, locale = 'uz-UZ') => {
  if (!date) return '';

  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

/**
 * Вақтни форматлаш
 * @param {string|Date} date - Сана
 * @param {string} locale - Локал (default: 'uz-UZ')
 * @returns {string} Форматланган вақт
 */
export const formatTime = (date, locale = 'uz-UZ') => {
  if (!date) return '';

  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
};

/**
 * Рақамни форматлаш (пул учун)
 * @param {number} amount - Миқдор
 * @param {string} currency - Валюта (default: 'UZS')
 * @returns {string} Форматланган рақам
 */
export const formatCurrency = (amount, currency = 'UZS') => {
  if (typeof amount !== 'number') return '0';

  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Текстни қисқартириш
 * @param {string} text - Текст
 * @param {number} length - Максимал узунлик
 * @returns {string} Қисқартирилган текст
 */
export const truncateText = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return text.slice(0, length) + '...';
};

/**
 * Объектни тоза кўринишга келтириш (null, undefined ларни олиб ташлаш)
 * @param {Object} obj - Объект
 * @returns {Object} Тозаланган объект
 */
export const cleanObject = (obj) => {
  const cleaned = {};

  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      cleaned[key] = obj[key];
    }
  });

  return cleaned;
};

/**
 * Массивни гуруҳлаш
 * @param {Array} array - Массив
 * @param {string} key - Гуруҳлаш калити
 * @returns {Object} Гуруҳланган объект
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Debounce функцияси
 * @param {Function} func - Функция
 * @param {number} delay - Кечикиш (ms)
 * @returns {Function} Debounced функция
 */
export const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Local Storage ва Session Storage билан ишлаш
 */
export const storage = {
  // Local Storage
  setLocal: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage set error:', error);
    }
  },

  getLocal: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('localStorage get error:', error);
      return defaultValue;
    }
  },

  removeLocal: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage remove error:', error);
    }
  },

  // Session Storage
  setSession: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('sessionStorage set error:', error);
    }
  },

  getSession: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('sessionStorage get error:', error);
      return defaultValue;
    }
  },

  removeSession: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('sessionStorage remove error:', error);
    }
  }
};

/**
 * URL параметрларини олиш
 * @param {string} param - Параметр номи
 * @returns {string|null} Параметр қиймати
 */
export const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

/**
 * Email валидацияси
 * @param {string} email - Email манзил
 * @returns {boolean} Валид эканми
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Парол кучлилигини текшириш
 * @param {string} password - Парол
 * @returns {Object} Текшириш натижаси
 */
export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;

  let strength = 'Заиф';
  if (score >= 4) strength = 'Кучли';
  else if (score >= 3) strength = 'Ўртача';

  return {
    score,
    strength,
    checks
  };
};

export default {
  formatDate,
  formatTime,
  formatCurrency,
  truncateText,
  cleanObject,
  groupBy,
  debounce,
  storage,
  getUrlParam,
  isValidEmail,
  checkPasswordStrength,
};
