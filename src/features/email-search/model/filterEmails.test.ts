import { describe, it, expect } from 'vitest';
import { filterEmails } from './filterEmails';
import { mockEmails } from '../../../test/fixtures';

describe('filterEmails', () => {
  it('returns all emails on empty query', () => {
    expect(filterEmails(mockEmails, '')).toHaveLength(mockEmails.length);
  });

  it('filters by subject', () => {
    expect(filterEmails(mockEmails, 'Lunch')).toEqual([mockEmails[2]]);
  });

  it('filters by from', () => {
    expect(filterEmails(mockEmails, 'noreply')).toEqual([mockEmails[1]]);
  });

  it('filters by body', () => {
    expect(filterEmails(mockEmails, 'welcome')).toEqual([mockEmails[0]]);
  });

  it('returns empty array when no match', () => {
    expect(filterEmails(mockEmails, 'nothing-matches-this')).toEqual([]);
  });
});
