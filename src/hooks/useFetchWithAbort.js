import { useState, useEffect } from 'react';

export const useFetchWithAbort = (endpoint, options) => {
  const [fetchedData, setFetchedData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          ...options,
          signal: abortController.signal
        });
        if (!response.ok) {
          throw new Error('Fetch response was not OK');
        }
        const newData = await response.json();
        setIsLoading(false);
        setFetchedData(newData);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [endpoint, options]);

  return { fetchedData, isLoading, error };
};
