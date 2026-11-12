/**
 * Checks docs/website-copy.md against the source.
 *
 * Every entry in the doc looks like
 *
 *   - **Label** (`path/to/file.tsx:42`): the copy as it appears on the site
 *
 * This finds each entry's text in its file. An entry that isn't found has been
 * edited in the doc (or in the code) since the last sync: that's the list of
 * copy changes still to apply. `{curly}` parts stand for values the code fills
 * in (a name, a year, a count) and match anything.
 *
 *   node scripts/check-copy.mjs               report entries that don't match
 *   node scripts/check-copy.mjs --fix-lines   also correct drifted line numbers
 */
import { readFileSync, writeFileSync } from "node:fs";

const DOC = "docs/website-copy.md";
const ENTRY = /^- \*\*(.+?)\*\* \(`([^`:]+):(\d+)`\): (.*)$/;
const ENTITIES = {
  "&apos;": "'",
  "&amp;": "&",
  "&quot;": '"',
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&lsquo;": "‘",
  "&rsquo;": "’",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
};

const decode = (text) => text.replace(/&[a-z]+;/g, (entity) => ENTITIES[entity] ?? entity);

/** JSX and string quirks that make source text differ from what's shown. */
const normalize = (text) =>
  decode(text)
    .replace(/\{" "\}/g, " ")
    .replace(/["'`]\s*\+\s*["'`]/g, "") // "a " + "b"
    .replace(/\s+/g, " ");

const stripTags = (text) => text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The entry's text as a regex, with {placeholders} matching anything short. */
const toPattern = (text) =>
  new RegExp(
    normalize(text)
      .split(/\{[^}]*\}/)
      .map(escapeRegExp)
      .join(".{0,90}?"),
  );

const fixLines = process.argv.includes("--fix-lines");
const docText = readFileSync(DOC, "utf8");
// The doc may be saved with Windows (CRLF) or Unix line endings; keep whichever it uses.
const eol = docText.includes("\r\n") ? "\r\n" : "\n";
const lines = docText.split(/\r?\n/);
const files = new Map();
const load = (path) => {
  if (!files.has(path)) {
    const raw = readFileSync(path, "utf8");

    files.set(path, { raw: raw.split("\n"), whole: normalize(raw) });
  }

  return files.get(path);
};

let checked = 0;
const missing = [];
let moved = 0;

lines.forEach((line, index) => {
  const match = ENTRY.exec(line);

  if (!match) return;

  const [, label, path, declared, text] = match;
  let source;

  try {
    source = load(path);
  } catch {
    missing.push({ label, path, declared, text, reason: "file not found" });

    return;
  }

  checked += 1;
  const pattern = toPattern(text);

  if (!pattern.test(source.whole) && !pattern.test(stripTags(source.whole))) {
    missing.push({ label, path, declared, text, source, reason: "text not found" });

    return;
  }

  // Found. Where does it actually start? (Only matters for the line number.)
  const lead = normalize(text.split(/\{[^}]*\}/)[0]).trim().slice(0, 24);

  if (!lead) return;

  const hits = source.raw.flatMap((raw, i) => (normalize(raw).includes(lead) ? [i + 1] : []));

  if (hits.length === 0) return;

  const actual = hits.reduce((best, n) => (Math.abs(n - declared) < Math.abs(best - declared) ? n : best));

  if (actual !== Number(declared)) {
    moved += 1;

    if (fixLines) lines[index] = line.replace(`\`${path}:${declared}\``, `\`${path}:${actual}\``);
  }
});

if (fixLines && moved > 0) writeFileSync(DOC, lines.join(eol));

console.log(`${checked} entries checked.`);
if (moved > 0) console.log(fixLines ? `${moved} line numbers corrected.` : `${moved} line numbers have drifted (run with --fix-lines).`);

if (missing.length === 0) {
  console.log("All copy matches the code.");
} else {
  console.log(`\n${missing.length} entr${missing.length === 1 ? "y doesn't" : "ies don't"} match the code, so ${missing.length === 1 ? "it needs" : "they need"} updating:\n`);

  for (const { label, path, declared, text, source, reason } of missing) {
    console.log(`✗ ${label}  (${path}:${declared}, ${reason})`);
    console.log(`    doc: ${text}`);

    if (source) {
      const start = Math.max(0, Number(declared) - 2);

      console.log(`    code near line ${declared}:`);
      source.raw.slice(start, start + 4).forEach((raw, i) => console.log(`      ${start + i + 1}: ${raw.trim().slice(0, 140)}`));
    }
  }

  process.exitCode = 1;
}
