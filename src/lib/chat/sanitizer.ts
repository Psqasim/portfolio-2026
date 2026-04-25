export type SanitizeResult =
  | { ok: true; text: string }
  | { ok: false; reason: "too_long" | "empty" };

const MAX_LEN = 500;

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_RE = /\+?\d[\d\s.\-()]{8,}/g;
const CARD_RE = /\b(?:\d[ -]?){13,19}\b/g;

export function sanitize(input: string): SanitizeResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { ok: false, reason: "empty" };
  }
  if (trimmed.length > MAX_LEN) {
    return { ok: false, reason: "too_long" };
  }

  // Order matters: card first (longest digit runs), then phone, then email.
  // A 16-digit card sequence can otherwise be partially eaten by the phone regex.
  const text = trimmed
    .replace(CARD_RE, "[card redacted]")
    .replace(PHONE_RE, "[phone redacted]")
    .replace(EMAIL_RE, "[email redacted]");

  return { ok: true, text };
}
