import type { Email } from '@entities/email';
import { matchesQuery } from '@shared/lib/textSearch';

const SEARCHABLE_FIELDS: Array<keyof Email> = ['from', 'to', 'subject', 'body'];

export function filterEmails(emails: Email[], query: string): Email[] {
  if (!query.trim()) return emails;
  return emails.filter((email) => matchesQuery(email, query, SEARCHABLE_FIELDS));
}
