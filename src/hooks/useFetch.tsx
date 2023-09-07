import { useState, useEffect } from 'react';
import { Data } from '../type/Type';
import { BASE_URL } from '../constants/constants';
// import { CacheManager } from '../utils/cacheManager';

interface DataState {
  data: Data[] | null;
  loading: boolean;
  error: unknown | null;
}

export default function useFetch(query: string) {
  const [dataState, setDataState] = useState<DataState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // const cache = new CacheManager(query);

    // if (cache.get)
    const fetchTimeout = setTimeout(() => {
      const fetchData = async () => {
        try {
          if (query.length) {
            const response = await fetch(`${BASE_URL}?q=${query}`);
            console.info('calling api');
            if (!response.ok) {
              throw new Error(`${response.status}`);
            }

            const responseData = await response.json();

            setDataState({
              data: responseData,
              loading: true,
              error: null,
            });
          }
          if (!query) {
            setDataState({
              data: null,
              loading: true,
              error: null,
            });
          }
        } catch (error) {
          setDataState({
            data: null,
            loading: false,
            error: error,
          });
        } finally {
          setDataState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }
      };

      fetchData();
    }, 300);

    return () => {
      clearTimeout(fetchTimeout);
    };
  }, [query]);

  const { data, loading, error } = dataState;

  return { data, loading, error };
}
