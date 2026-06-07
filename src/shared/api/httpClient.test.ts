import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpError, httpGet } from './httpClient';

describe('httpGet', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed json on success', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ hello: 'world' }),
    });
    const result = await httpGet<{ hello: string }>('/path');
    expect(result).toEqual({ hello: 'world' });
    expect(fetch).toHaveBeenCalledWith('/path', { signal: undefined });
  });

  it('throws HttpError on non-ok response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    });
    await expect(httpGet('/x')).rejects.toBeInstanceOf(HttpError);
    await expect(httpGet('/x')).rejects.toMatchObject({ status: 500 });
  });

  it('passes abort signal', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    const controller = new AbortController();
    await httpGet('/abort', controller.signal);
    expect(fetch).toHaveBeenCalledWith('/abort', { signal: controller.signal });
  });
});
