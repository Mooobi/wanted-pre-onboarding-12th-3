export class CacheManager {
  cacheName: string;

  constructor(cacheName: string) {
    this.cacheName = cacheName;
  }

  async get(key: string) {
    try {
      const cache = await caches.open(this.cacheName);
      const cachedResponse = await cache.match(key);

      if (cachedResponse) {
        return cachedResponse;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async set(key: string, data: Response) {
    try {
      const cache = await caches.open(this.cacheName);
      await cache.put(key, data.clone());
    } catch (error) {
      console.error(error);
    }
  }
}
