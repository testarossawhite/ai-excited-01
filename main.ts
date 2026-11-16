import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ai-excited-01 (round 2): the entry is a single image. This script copies
// entry.png, which sits next to this file, into the output directory.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const target = join(outDir, "entry.png");

if (!existsSync(source)) {
  console.error(`entry.png not found next to main.ts: ${source}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Guard against a truncated or partial copy: the output must be
// byte-identical to the entry image that ships with this repo.
if (!readFileSync(source).equals(readFileSync(target))) {
  console.error(`copy mismatch: ${target} differs from ${source}`);
  process.exit(1);
}

console.log(`wrote ${target} (${statSync(target).size} bytes)`);
