import { useState, useEffect } from 'react';
import { debounce } from '../utils/helpers';

/**
 * Debounced input hook
 * @param {string} initialValue - Дастлабки қиймат
 * @param {number} delay - Кечикиш миллисонияларда
 * @returns {Array} [debouncedValue, value, setValue]
 */
export const useDebounce = (initialValue = '', delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    handler();

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, value, setValue];
};

export default useDebounce;
