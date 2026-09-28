// Crockford base32: no I, L, O or U, so references are easy to read aloud.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** `RFQ-YYMMDD-XXXX`, e.g. `RFQ-260926-7K3P`. */
export function createRfqReference(now: Date = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(bytes, (b) => ALPHABET[b % 32]).join("");

  return `RFQ-${yy}${mm}${dd}-${suffix}`;
}
