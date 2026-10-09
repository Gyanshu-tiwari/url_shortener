import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shortenUrl } from './urlApi.js';

describe('urlApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should successfully call API and return shortened response', async () => {
    const mockResponse = {
      success: true,
      shortUrl: 'http://localhost:3000/xyz789',
      shortCode: 'xyz789',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await shortenUrl({ originalUrl: 'https://example.com' });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error with message from server if request fails', async () => {
    const errorBody = { success: false, message: 'Invalid originalUrl' };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => errorBody,
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(shortenUrl({ originalUrl: 'invalid' })).rejects.toThrow('Invalid originalUrl');
  });

  it('should provide fallback error message if server returns non-json error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error('Not JSON');
      },
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(shortenUrl({ originalUrl: 'invalid' })).rejects.toThrow('Failed to shorten URL');
  });
});
