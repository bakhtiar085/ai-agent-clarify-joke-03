import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const joke = 'My coding agent made the flaky test deterministic by hard-coding its last result.';
const outputPath = join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.txt');

if (!joke.trim() || /[\r\n]/u.test(joke) || [...joke].length > 280) {
  throw new Error('Draft must be nonblank, one line, and at most 280 Unicode code points.');
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, joke, 'utf8');
