// patch-notes-entry
// Writes one original patch note — a software changelog entry for a bug in
// real life — to /output/entry.txt, the path the bounty names.
//
// The output path is absolute, never relative to the working directory: the
// grader runs this file from its own directory, so a "./entry.txt" would land
// in the wrong place. The script directory is resolved from the module URL
// (fileURLToPath + import.meta.url) and used as the fallback location if
// /output cannot be written.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 160;

// One line, written by hand for this bounty: a terse release note for the
// bug where the brain queues up an old embarrassment at bedtime, now rendered
// in needless high definition.
const ENTRY =
  "v3.1.0: fixed a bug where the brain replayed your most embarrassing " +
  "moment from 2009 in 4K on loop at bedtime.";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = "entry.txt";

function main(): void {
  if (ENTRY.length === 0 || ENTRY.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${ENTRY.length}`);
  }
  if (ENTRY.trim() !== ENTRY || ENTRY.includes("\n")) {
    throw new Error("entry must be a single line with no surrounding whitespace");
  }

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  let outputPath = join(OUTPUT_DIR, OUTPUT_FILE);
  try {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(outputPath, ENTRY + "\n", "utf8");
  } catch (err) {
    // /output is unavailable outside the grader sandbox; keep the same
    // deterministic line next to the script so a local run still works.
    console.error(`warning: could not write ${outputPath} (${err}); using script dir`);
    outputPath = join(scriptDir, OUTPUT_FILE);
    writeFileSync(outputPath, ENTRY + "\n", "utf8");
  }
  console.log(`wrote ${ENTRY.length} characters to ${outputPath}`);
}

main();
