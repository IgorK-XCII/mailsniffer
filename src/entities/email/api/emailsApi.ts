import { httpGet } from '@shared/api/httpClient';
import type { Email } from '../model/types';

export const fetchEmails = (signal?: AbortSignal): Promise<Email[]> =>
  httpGet<Email[]>('/emails', signal);
