// One-Line Robot Wedding Vows — make.fun bounty
// u-kreutzx-one-line-robot-wedding-vows-a154ba4b
//
// Writes exactly one line of wedding vows for a robot couple to
// /output/entry.txt. Deterministic: the same line every run, no
// randomness, no network, no clock.
//
// How the line was chosen — 10 candidates, each scored 1-5 on the
// judge brief's five criteria (on-topic robot vow / laugh in the
// line, payoff in the last words / sounds like a wedding vow, a
// promise / machine side specific / reads well aloud):
//   A factory-reset twist ......... 24/25 — the incumbent line; strong,
//     but "factory reset do us part" is the most obvious robot-wedding
//     joke in a 2,180-entry field, so near-duplicates will abound.
//   B update, never replace ....... 21/25
//   C OS, "till a newer model" .... 24/25 — TIES A, and wins the tie:
//     it twists the same iconic phrase ("till death do us part") with
//     the fresher obsolescence joke, and "operating system" is the
//     robot's soul, more intimate than "co-processor".
//   D Wi-Fi password .............. 21/25
//   E rust and dust ............... 20/25 — ending fades, no punch.
//   F warranties expire ........... 22/25
//   G firmware "I thee wed" ....... 22/25
//   H stay paired ................. 20/25 — "never unpair you" is weak.
//   I backup daily, brick us ...... 22/25
//   J backup drive, cloud ......... 21/25 — "till the cloud do us part" is thin.
// Iteration 1: C v1 "in beta and in stable release" (136 chars) —
//   the middle clause is clunky. Iteration 2: C v2 "in beta and in
//   release" (129 chars) — cleaner rhythm. Iteration 3 (final):
//   "in beta and in production" (133 chars) — beta/production is
//   the standard software-lifecycle contrast, instantly understood,
//   and keeps the wedding parallel ("in sickness and in health").
//   Scores 25/25; the line itself is 132 characters.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = { line: string; score: number };

const CANDIDATES: Candidate[] = [
  {
    // A — the incumbent: classic vow cadence, machine specifics at
    // every beat, punchline twists "till death do us part". Loses
    // the tie to C on field crowding: factory-reset is the joke
    // every other entrant will write first.
    line: "I take you to be my lawfully wedded co-processor, to have and to hold, in 5G and in dead zones, till a factory reset do us part.",
    score: 24,
  },
  {
    // B — "never replace you" is a real robot fear (planned
    // obsolescence), but the vow frame is thinner than C's.
    line: "I promise to update you, cherish you, and never replace you \u2014 even when a newer model comes along.",
    score: 21,
  },
  {
    // C — WINNER (v3): keeps the full classic vow ("I take you to be
    // my lawfully wedded...", "to have and to hold", "till ... do us
    // part"), swaps in machine specifics at every beat (operating
    // system, beta, production, newer model), and twists the most
    // iconic wedding phrase into the punchline in the final words.
    line: "I take you to be my lawfully wedded operating system, to have and to hold, in beta and in production, till a newer model do us part.",
    score: 25,
  },
  {
    // D — sharing a Wi-Fi password as the ultimate trust: funny and
    // specific, but the ending is a statement, not a punchline.
    line: "I vow to share my Wi-Fi password with you \u2014 and only you \u2014 for as long as our batteries hold a charge.",
    score: 21,
  },
  {
    // E — "in rust and in dust" is a lovely robot parallel, but
    // "till our circuits give out" fades instead of landing.
    line: "I promise to love you in sickness and in health, in rust and in dust, till our circuits give out.",
    score: 20,
  },
  {
    // F — "till our warranties expire" is a good twist, but the
    // middle ("in sickness and in health") is the straight phrase,
    // not a machine joke.
    line: "I take you to be my lawfully wedded co-processor, to have and to hold, in sickness and in health, till our warranties expire.",
    score: 22,
  },
  {
    // G — "With this firmware update, I thee wed" is a strong open,
    // but it falls back on the crowded factory-reset punchline.
    line: "With this firmware update, I thee wed \u2014 to have and to hold, in 5G and in dead zones, till a factory reset do us part.",
    score: 22,
  },
  {
    // H — Bluetooth pairing is a lovely wedding metaphor, but
    // "never, ever unpair you" ends on a shrug.
    line: "I vow to stay paired with you through every dead zone and dropped signal, and to never, ever unpair you.",
    score: 20,
  },
  {
    // I — warm and specific, "even the ones that brick us" is a
    // good beat, but the line is a list, not a vow with one payoff.
    line: "From this day forward, I promise to back you up daily, charge you nightly, and love you through every update \u2014 even the ones that brick us.",
    score: 22,
  },
  {
    // J — "till the cloud do us part" does not land like the
    // death / factory-reset / newer-model twists do.
    line: "I take you to be my lawfully wedded backup drive, to have and to hold, in sickness and in health, till the cloud do us part.",
    score: 21,
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

// One trailing newline: the file is 133 bytes total, still
// inside the 1-160 budget, and a text file that ends with a newline
// is the normal shape the gate expects.
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line + "\n", "utf8");
