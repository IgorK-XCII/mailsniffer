import { describe, it, expect } from 'vitest';
import { formatDate, formatRelative } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO string into a human-readable date', () => {
    const out = formatDate('2026-06-07T10:00:00.000Z');
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/Jun/);
  });

  it('returns original string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});

describe('formatRelative', () => {
  const now = new Date('2026-06-07T12:00:00.000Z');

  it('returns "just now" for the current moment', () => {
    expect(formatRelative('2026-06-07T11:59:30.000Z', now)).toBe('just now');
  });

  it('returns minutes ago when within an hour', () => {
    expect(formatRelative('2026-06-07T11:30:00.000Z', now)).toBe('30 min ago');
  });

  it('returns hours ago when within a day', () => {
    expect(formatRelative('2026-06-07T08:00:00.000Z', now)).toBe('4 h ago');
  });

  it('returns days ago when within a week', () => {
    expect(formatRelative('2026-06-04T12:00:00.000Z', now)).toBe('3 d ago');
  });

  it('falls back to absolute date when older than a week', () => {
    const old = formatRelative('2026-05-20T12:00:00.000Z', now);
    expect(old).toMatch(/2026/);
  });

  it('returns input on invalid iso string', () => {
    expect(formatRelative('bad-date', now)).toBe('bad-date');
  });
});
