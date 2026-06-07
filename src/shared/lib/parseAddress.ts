/**
 * Decodes RFC 2047 "encoded-word" tokens that mail servers stuff into
 * address headers when the display name contains non-ASCII characters.
 *
 * Format:
 *   =?charset?encoding?text?=
 * where encoding is `B` (base64) or `Q` (quoted-printable with `_` meaning space).
 *
 * Example:
 *   "=?UTF-8?B?0KHQsdC10YAgSUQ=?=<example.from@mail.ru>"
 *      → "Сбер ID <example.from@mail.ru>"
 */

const ENCODED_WORD_RE = /=\?([^?]+)\?([bBqQ])\?([^?]*)\?=/g;

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64.replace(/\s+/g, ''));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

function quotedPrintableToBytes(qp: string): Uint8Array {
  // RFC 2047 Q-encoding: `_` is literal space, `=XX` is a hex byte.
  const replaced = qp.replace(/_/g, ' ');
  const bytes: number[] = [];
  for (let i = 0; i < replaced.length; i += 1) {
    const ch = replaced[i];
    if (ch === '=' && i + 2 < replaced.length) {
      const hex = replaced.slice(i + 1, i + 3);
      const value = Number.parseInt(hex, 16);
      if (Number.isNaN(value)) {
        bytes.push(ch.charCodeAt(0));
      } else {
        bytes.push(value);
        i += 2;
      }
    } else {
      bytes.push(ch.charCodeAt(0));
    }
  }
  return Uint8Array.from(bytes);
}

export function decodeMimeWord(raw: string): string {
  if (!raw) return raw;
  return raw.replace(
    ENCODED_WORD_RE,
    (match, charset: string, encoding: string, text: string) => {
      try {
        const bytes =
          encoding.toUpperCase() === 'B'
            ? base64ToBytes(text)
            : quotedPrintableToBytes(text);
        return new TextDecoder(charset.toLowerCase()).decode(bytes);
      } catch {
        // Fallback: leave the raw token in place so the user at least sees something.
        return match;
      }
    },
  );
}

/**
 * Normalizes an address header for display.
 * - decodes RFC 2047 encoded-words
 * - inserts a space between display name and `<addr>` when the source omits it
 *   ("Name<a@b>" → "Name <a@b>")
 */
export function decodeAddress(raw: string | null | undefined): string {
  if (!raw) return '';
  const decoded = decodeMimeWord(raw);
  return decoded.replace(/(\S)<([^>]+)>/g, '$1 <$2>').trim();
}
