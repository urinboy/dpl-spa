import { useState, useEffect } from 'react';

/**
 * API сўровлари учун hook
 * @param {Function} apiCall - API функцияси
 * @param {Array} dependencies - Dependencies массиви
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!apiCall) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message || 'API сўровида хато');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useApi;
