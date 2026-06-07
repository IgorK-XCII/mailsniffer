import { httpGet } from '@shared/api/httpClient';
import type { Email } from '../model/types';

export function fetchEmails(signal?: AbortSignal): Promise<Email[]> {
  return httpGet<Email[]>('/emails', signal);
}
