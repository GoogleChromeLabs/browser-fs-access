import assert from 'node:assert/strict';
import { test } from 'node:test';
import directoryOpen from '../src/legacy/directory-open.mjs';

const paths = [
  '.project/.env',
  '.project/readme.txt',
  '.project/src/.env',
  '.project/src/main.js',
  '.project/.git/config',
  '.project/src/.cache/data',
];

const open = async (options) => {
  const listeners = {};
  const input = {
    style: {},
    files: paths.map((webkitRelativePath) => ({ webkitRelativePath })),
    addEventListener(type, listener) {
      listeners[type] = listener;
    },
    remove() {},
    click() {
      listeners.change();
    },
  };
  globalThis.HTMLInputElement = class {};
  globalThis.document = {
    createElement: () => input,
    body: { append() {} },
  };
  return (await directoryOpen(options)).map((file) => file.webkitRelativePath);
};

test('only passes nested directories to skipDirectory, not root or file names', async () => {
  const seen = [];
  const actual = await open({
    recursive: true,
    skipDirectory(entry) {
      seen.push(entry);
      return entry.name.startsWith('.');
    },
  });
  assert.deepEqual(actual, paths.slice(0, 4));
  assert.ok(seen.length);
  assert.ok(seen.every((entry) => entry.kind === 'directory'));
  assert.ok(
    seen.every(
      (entry) =>
        ![
          '.project',
          '.env',
          'readme.txt',
          'main.js',
          'config',
          'data',
        ].includes(entry.name)
    )
  );
});

test('does not consult skipDirectory for files directly in the selected root', async () => {
  const actual = await open({ recursive: true, skipDirectory: () => true });
  assert.deepEqual(actual, paths.slice(0, 2));
});

test('keeps all files when no directory is skipped', async () => {
  assert.deepEqual(
    await open({ recursive: true, skipDirectory: () => false }),
    paths
  );
});

test('non-recursive mode returns root files without consulting skipDirectory', async () => {
  assert.deepEqual(
    await open({
      recursive: false,
      skipDirectory() {
        throw new Error('not recursive');
      },
    }),
    paths.slice(0, 2)
  );
});

test('recursive mode without a skip callback keeps all files', async () => {
  assert.deepEqual(await open({ recursive: true }), paths);
});
