const cacheService = require('../../src/services/cacheService');

describe('CacheService', () => {
  beforeEach(() => { });

  test('deve armazenar e recuperar um valor', () => {
    const key = 'test-key-1';
    const value = { data: 'test-data' };
    cacheService.set(key, value, 60);

    const result = cacheService.get(key);
    expect(result).toEqual(value);
  });

  test('deve retornar null para chave inexistente', () => {
    const result = cacheService.get('non-existent-key');
    expect(result).toBeNull();
  });

  test('deve expirar itens com base no TTL', async () => {
    const key = 'expiry-key';
    const value = 'expiry-value';
    const originalDateNow = Date.now;

    const mockNow = 1000000;
    global.Date.now = jest.fn(() => mockNow);

    cacheService.set(key, value, 1);

    expect(cacheService.get(key)).toBe(value);

    global.Date.now = jest.fn(() => mockNow + 61000);

    expect(cacheService.get(key)).toBeNull();

    global.Date.now = originalDateNow;
  });
});
