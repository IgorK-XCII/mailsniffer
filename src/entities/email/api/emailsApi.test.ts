import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchEmails } from './emailsApi';
import { mockEmails } from '../../../test/fixtures';

describe('fetchEmails', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockEmails),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls /emails and returns parsed response', async () => {
    const res = await fetchEmails();
    expect(res).toEqual(mockEmails);
    expect(fetch).toHaveBeenCalledWith('/emails', { signal: undefined });
  });
});
