import type { Nullable } from '@shared/types';

export type Email = {
  id: string;
  from: string;
  to: string;
  cc: Nullable<string>;
  bcc: Nullable<string>;
  subject: string;
  body: string;
  contentType: string;
  hasAttachments: boolean;
  receivedAt: string;
};
