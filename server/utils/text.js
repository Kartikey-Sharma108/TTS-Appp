/**
 * Text helpers: sanitize user input and escape XML for SSML-based providers.
 */

// Removes characters that are invalid for speech synthesis / transport,
// such as control characters (NUL, BEL, ...) while keeping normal Unicode.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F]', 'g');

/**
 * Returns a cleaned, single-line string safe to send to a TTS provider.
 * Returns '' when nothing usable remains.
 */
export function sanitizeText(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .normalize('NFC')
    .replace(CONTROL_CHARS, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Escapes text for inclusion inside an XML/SSML document. */
export function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
