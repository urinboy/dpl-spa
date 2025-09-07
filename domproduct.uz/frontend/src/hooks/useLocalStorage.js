import { useState, useEffect } from 'react';

/**
 * Local Storage билан синхронланган state hook
 * @param {string} key - Storage калити
 * @param {any} initialValue - Дастлабки қиймат
 * @returns {Array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Storage дан қиймат олиш
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Storage га қиймат ёзиш
  const setValue = (value) => {
    try {
      // Функция бўлса ишга тушириш
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
