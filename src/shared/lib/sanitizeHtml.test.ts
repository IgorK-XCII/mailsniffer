import { describe, it, expect } from 'vitest';
import { isHtml, sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('keeps safe markup', () => {
    const out = sanitizeHtml('<p>Hello <strong>world</strong></p>');
    expect(out).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('strips script tags', () => {
    const out = sanitizeHtml('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toContain('<script');
    expect(out).toContain('<p>ok</p>');
  });

  it('strips inline event handlers', () => {
    const out = sanitizeHtml('<img src="x" onerror="alert(1)" />');
    expect(out).not.toContain('onerror');
  });
});

describe('isHtml', () => {
  it('detects html content type', () => {
    expect(isHtml('text/html', 'plain')).toBe(true);
    expect(isHtml('text/HTML; charset=utf-8', 'plain')).toBe(true);
  });

  it('returns true when body contains tags even with text/plain', () => {
    expect(isHtml('text/plain', '<p>Hi</p>')).toBe(true);
  });

  it('returns false for plain text', () => {
    expect(isHtml('text/plain', 'just a string')).toBe(false);
  });
});
