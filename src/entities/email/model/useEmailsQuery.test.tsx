import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEmailsQuery } from './useEmailsQuery';
import { mockEmails } from '../../../test/fixtures';

const wrapper = (client: QueryClient) => {
  const Wrap = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrap;
};

describe('useEmailsQuery', () => {
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

  it('fetches emails and returns data', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { result } = renderHook(() => useEmailsQuery({ pollingInterval: false as unknown as number }), {
      wrapper: wrapper(client),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockEmails);
  });

  it('does not fetch when disabled', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { result } = renderHook(
      () => useEmailsQuery({ enabled: false, pollingInterval: false as unknown as number }),
      { wrapper: wrapper(client) },
    );
    expect(result.current.fetchStatus).toBe('idle');
  });
});
