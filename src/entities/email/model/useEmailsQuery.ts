import { useQuery } from '@tanstack/react-query';
import { POLLING_INTERVAL_MS, QUERY_KEYS } from '@shared/config/constants';
import { fetchEmails } from '../api/emailsApi';
import type { Email } from './types';

export interface UseEmailsQueryOptions {
  pollingInterval?: number;
  enabled?: boolean;
}

export function useEmailsQuery(options: UseEmailsQueryOptions = {}) {
  const { pollingInterval = POLLING_INTERVAL_MS, enabled = true } = options;

  return useQuery<Email[]>({
    queryKey: QUERY_KEYS.emails,
    queryFn: ({ signal }) => fetchEmails(signal),
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: false,
    enabled,
  });
}
