import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const forbidden = [
  /cm@example\.invalid/i,
  /senior-qs@example\.invalid/i,
  /Synthetic Protected Project/i,
  /foundationSeed/i,
  /service[_-]?account/i,
];

async function files(directory) {
  const entries = await readdir(directory);
  const output = [];
  for (const entry of entries) {
    const path = join(directory, entry);
    if ((await stat(path)).isDirectory()) output.push(...await files(path));
    else output.push(path);
  }
  return output;
}

for (const path of await files('dist')) {
  const text = await readFile(path, 'utf8').catch(() => '');
  for (const pattern of forbidden) {
    if (pattern.test(text)) throw new Error(`Production build contains forbidden test/sensitive marker: ${pattern}`);
  }
}

process.stdout.write('Production build scan passed.\n');
