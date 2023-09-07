import { Data } from '../type/Type';
import { CacheManager } from './cacheManager';

export default async function setCacheData(
  cacheManager: CacheManager,
  query: string,
  data: Data[],
) {
  const responseData = new Response(JSON.stringify(data), {
    status: 200,
    statusText: 'OK',
  });

  await cacheManager.set(query, responseData);
}
