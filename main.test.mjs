import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repo = fileURLToPath(new URL('.', import.meta.url));
const expected = 'My AI coding agent asked me to clarify its plan, so I pasted it back. It said, “That’s much clearer.”';

test('creates a nested output directory and writes exactly the approved deterministic joke', () => {
  const testRoot = mkdtempSync(join(repo, '.joke-test-'));
  const outputDir = join(testRoot, 'new', 'nested', 'output');
  try {
    assert.equal(existsSync(outputDir), false);
    for (let run = 0; run < 2; run += 1) {
      const result = spawnSync(process.execPath, [join(repo, 'main.ts')], {
        env: { ...process.env, MAKEFUN_OUTPUT_DIR: outputDir },
        encoding: 'utf8',
      });
      assert.equal(result.status, 0, result.stderr);
      const bytes = readFileSync(join(outputDir, 'entry.txt'));
      assert.deepEqual(bytes, Buffer.from(expected, 'utf8'));
      assert.equal([...bytes.toString('utf8')].length, 101);
      assert.deepEqual(readdirSync(outputDir), ['entry.txt']);
    }
  } finally {
    rmSync(testRoot, { recursive: true, force: true });
  }
});
