// One-Line Robot Wedding Vows — make.fun bounty
// u-kreutzx-one-line-robot-wedding-vows-a154ba4b
//
// Writes exactly one line of wedding vows for a robot couple to
// /output/entry.txt. Deterministic: the same line every run, no
// randomness, no network, no clock.
//
// How the line was chosen (scored against the judge's brief):
//  1. It must be a one-line robot wedding vow that lands as a joke.
//  2. The laugh must sit in the line itself, paying off in the last words.
//  3. It must sound like a wedding vow — a promise, not just a gag.
//  4. The machine side must be specific (firmware, batteries, ports...).
//  5. It must read well aloud, with a rhythm that lets the laugh land.
//
// Candidate A wins on all five: it keeps the classic vow cadence
// ("I take you to be my lawfully wedded...", "to have and to hold",
// "till ... do us part") so the officiant's ear hears a real vow,
// swaps in machine specifics at every beat (co-processor, 5G, dead
// zones, factory reset), and twists the most iconic wedding phrase
// into the punchline in the final words.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = { line: string; score: number };

const CANDIDATES: Candidate[] = [
  {
    // A — classic vow cadence, machine specifics at every beat,
    // punchline twists "till death do us part" in the final words.
    line: "I take you to be my lawfully wedded co-processor, to have and to hold, in 5G and in dead zones, till a factory reset do us part.",
    score: 9.5,
  },
  {
    // B — strong "buggy you get" punchline, but the vow frame is
    // thinner and the factory-reset joke lands mid-line.
    line: "I vow to love you through every update, every crash, and every low battery \u2014 and never to factory-reset you, no matter how buggy you get.",
    score: 8.5,
  },
  {
    // C — warm and specific, but the ending ("break everything")
    // is a shrug, not a payoff.
    line: "I promise to back you up daily, charge you nightly, and love you through every update \u2014 even the ones that break everything.",
    score: 7.5,
  },
  {
    // D — good "without a backup" ending, but "partner in code"
    // reads more like a work vow than a wedding vow.
    line: "I take you as my partner in code, to debug beside you, reboot with you, and never \u2014 ever \u2014 let you update without a backup.",
    score: 8.0,
  },
  {
    // E — solid, but "press your factory reset" repeats the
    // factory-reset joke other lines land harder.
    line: "I vow to stand by you through every patch, every crash, and every mandatory restart \u2014 and to never, ever press your factory reset.",
    score: 7.0,
  },
  {
    // F — sweet image (last charging cable at 2%), but the
    // promise is about stuff, not the marriage.
    line: "From this day forward, I promise to share my bandwidth, my battery, and my last charging cable \u2014 even when you're at 2%.",
    score: 7.5,
  },
  {
    // G — good twist, but the payoff sits mid-line; the ending
    // ("do us part") is the straight phrase, not the joke.
    line: "I promise to love you in sickness and in health, in Wi-Fi and in airplane mode, until death \u2014 or a factory reset \u2014 do us part.",
    score: 8.0,
  },
  {
    // H — same joke as A in fewer words, but loses the
    // "lawfully wedded" vow weight that makes A land.
    line: "I take you, my beloved co-processor, to have and to hold, through every update and dead zone, till a factory reset do us part.",
    score: 8.5,
  },
];

function pick(candidates: Candidate[]): string {
  // Deterministic: highest score wins; ties keep the earliest
  // candidate, so the same line is picked on every run.
  let best = candidates[0];
  for (const c of candidates) {
    if (c.score > best.score) best = c;
  }
  return best.line;
}

// The sealed gate wants /output/entry.txt as UTF-8 text of 1 to 160
// characters, not only whitespace, on one line. Validate the vow
// before writing anything, so a bad line fails loudly here instead
// of silently failing the gate.
function validate(line: string): void {
  if (line.length < 1 || line.length > 160) {
    throw new Error(`vow is ${line.length} characters, must be 1-160`);
  }
  if (line.trim().length === 0) {
    throw new Error("vow must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("vow must be a single line");
  }
  // No control characters: the line must read cleanly aloud.
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error("vow contains a control character");
    }
  }
}

const line = pick(CANDIDATES);
validate(line);

// One trailing newline: the file is 129 characters total, still
// inside the 1-160 budget, and a text file that ends with a newline
// is the normal shape the gate expects.
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line + "\n", "utf8");
