import { API_BASE_URL } from '@shared/config/constants';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export const httpGet = async <T>(path: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });

  if (!response.ok) {
    throw new HttpError(response.status, `Request to ${path} failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
