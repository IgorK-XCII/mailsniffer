import { describe, it, expect } from 'vitest';
import { decodeAddress, decodeMimeWord } from './parseAddress';

describe('decodeMimeWord', () => {
  it('returns the input unchanged when there are no encoded-words', () => {
    expect(decodeMimeWord('Alice <a@b.com>')).toBe('Alice <a@b.com>');
  });

  it('decodes a base64 UTF-8 encoded-word', () => {
    expect(decodeMimeWord('=?UTF-8?B?0KHQsdC10YAgSUQ=?=')).toBe('Сбер ID');
  });

  it('decodes quoted-printable with `_` as space and `=XX` hex bytes', () => {
    // "=?UTF-8?Q?Hello_World?=" → "Hello World"
    expect(decodeMimeWord('=?UTF-8?Q?Hello_World?=')).toBe('Hello World');
    // "Café" — é = 0xC3 0xA9
    expect(decodeMimeWord('=?UTF-8?Q?Caf=C3=A9?=')).toBe('Café');
  });

  it('leaves the token in place when charset is unknown', () => {
    const raw = '=?totally-bogus?B?aGk=?=';
    expect(decodeMimeWord(raw)).toBe(raw);
  });

  it('handles an empty string', () => {
    expect(decodeMimeWord('')).toBe('');
  });
});

describe('decodeAddress', () => {
  it('decodes encoded name and pads angle brackets with a space', () => {
    expect(
      decodeAddress('=?UTF-8?B?0KHQsdC10YAgSUQ=?=<example.from@mail.ru>'),
    ).toBe('Сбер ID <example.from@mail.ru>');
  });

  it('returns empty string for null/undefined input', () => {
    expect(decodeAddress(null)).toBe('');
    expect(decodeAddress(undefined)).toBe('');
  });

  it('leaves a plain ASCII address untouched', () => {
    expect(decodeAddress('Bob <bob@example.com>')).toBe('Bob <bob@example.com>');
  });

  it('handles raw email address without display name', () => {
    expect(decodeAddress('a@b.com')).toBe('a@b.com');
  });
});
