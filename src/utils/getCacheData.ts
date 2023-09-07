import { CacheManager } from './cacheManager';

export default async function getCachedData(cacheManager: CacheManager, query: string) {
  const cachedResponse = await cacheManager.get(query);

  if (cachedResponse) {
    const cachedData = await cachedResponse.json();
    console.info('get cached data');
    return cachedData;
  }

  return null;
}
