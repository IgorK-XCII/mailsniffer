import { describe, it, expect } from 'vitest';
import { matchesQuery } from './textSearch';

describe('matchesQuery', () => {
  const item = { from: 'alice@x.com', subject: 'Hello world', body: null };

  it('returns true on empty query', () => {
    expect(matchesQuery(item, '', ['from'])).toBe(true);
    expect(matchesQuery(item, '   ', ['from'])).toBe(true);
  });

  it('matches case-insensitively', () => {
    expect(matchesQuery(item, 'ALICE', ['from', 'subject'])).toBe(true);
  });

  it('does not match when no field includes value', () => {
    expect(matchesQuery(item, 'zzz', ['from', 'subject'])).toBe(false);
  });

  it('skips null fields gracefully', () => {
    expect(matchesQuery(item, 'foo', ['body'])).toBe(false);
  });
});
