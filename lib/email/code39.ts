/**
 * Code 39 — the barcode on chemical drum and reagent labels. Each character is
 * nine elements (bar, space, bar, space…), three of them wide. `n` is narrow,
 * `w` is wide.
 */
const PATTERNS: Record<string, string> = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  "*": "nwnnwnwnn",
};

export type BarcodeRun = { dark: boolean; width: number };

/**
 * The runs of bars and spaces for `text`, wrapped in the start/stop `*`. Text
 * outside Code 39's alphabet is dropped (references are only A–Z, 0–9 and `-`).
 * Widths are in pixels: narrow is `narrow`, wide is `narrow * 3`.
 */
export function code39Runs(text: string, narrow = 1): BarcodeRun[] {
  const runs: BarcodeRun[] = [];
  const characters = ["*", ...Array.from(text.toUpperCase()).filter((c) => c in PATTERNS && c !== "*"), "*"];

  characters.forEach((character, index) => {
    if (index > 0) runs.push({ dark: false, width: narrow }); // gap between characters

    Array.from(PATTERNS[character]).forEach((element, position) => {
      runs.push({ dark: position % 2 === 0, width: element === "w" ? narrow * 3 : narrow });
    });
  });

  return runs;
}

/** Total width in pixels of the runs. */
export function barcodeWidth(runs: BarcodeRun[]): number {
  return runs.reduce((total, run) => total + run.width, 0);
}
