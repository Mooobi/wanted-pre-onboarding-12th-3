// 요청을 보내기 전에 캐싱된 데이터가 있는지 확인 > class httpClient 생성
// 캐시 스토리지에 요청할 데이터가 있다면 요청 보내지 않고
// 캐시 스토리지에서 데이터를 가져와 화면에 출력
// 캐싱된 데이터가 없다면 요청 보내고
// 응답으로 온 데이터를 캐시스토리지에 저장

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

  async clear(key: string) {
    try {
      const cache = await caches.open(this.cacheName);
      await cache.delete(key);
    } catch (error) {
      console.error(error);
    }
  }
}
