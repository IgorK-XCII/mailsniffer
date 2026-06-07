export interface Email {
  id: string;
  from: string;
  to: string;
  cc: null | string;
  bcc: null | string;
  subject: string;
  body: string;
  contentType: string;
  hasAttachements: boolean;
  receivedAt: string;
}
