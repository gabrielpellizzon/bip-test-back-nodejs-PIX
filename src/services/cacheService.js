class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlSeconds) {
    const expiry = Date.now() + ttlSeconds * 60 * 1000;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const data = this.cache.get(key);
    if (!data) return null;

    if (Date.now() > data.expiry) {
      this.cache.delete(key);
      return null;
    }

    return data.value;
  }

  del(key) {
    this.cache.delete(key);
  }
}

module.exports = new CacheService();
