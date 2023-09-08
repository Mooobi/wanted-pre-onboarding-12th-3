import { useState, useEffect } from 'react';
import { Data } from '../type/Type';
import { BASE_URL } from '../constants/constants';
import { CacheManager } from '../utils/cacheManager';
import getCachedData from '../utils/getCacheData';
import setCacheData from '../utils/setCacheData';

interface DataState {
  data: Data[] | null;
  loading: boolean;
}

export default function useFetch(query: string) {
  const [dataState, setDataState] = useState<DataState>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    const cacheManager = new CacheManager(query);

    const fetchTimeout = setTimeout(() => {
      const fetchData = async () => {
        try {
          if (query.length) {
            const cachedData = await getCachedData(cacheManager, query);

            if (cachedData) {
              setDataState({
                data: cachedData,
                loading: false,
              });
              return;
            }

            const response = await fetch(`${BASE_URL}?q=${query}`);
            console.info('calling api');
            if (!response.ok) {
              throw new Error(`${response.status}`);
            }

            const responseData = await response.json();

            setCacheData(cacheManager, query, responseData);

            setDataState({
              data: responseData,
              loading: true,
            });
          }
          if (!query) {
            setDataState({
              data: null,
              loading: true,
            });
          }
        } catch (error) {
          setDataState({
            data: null,
            loading: false,
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

  const { data, loading } = dataState;

  return { data, loading };
}
