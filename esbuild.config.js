/* eslint-disable */
const fs = require('fs');
const esbuild = require('esbuild');
const { gzip } = require('zlib');

const name = process.env.npm_package_name || '';

async function main() {
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true }, (e) => {
      if (e) {
        throw e;
      }
    });
  }

  try {
    esbuild.buildSync({
      entryPoints: ['./src/index.js'],
      outdir: 'dist/cjs',
      minify: true,
      bundle: true,
      format: 'cjs',
      target: 'es6',
      external: [],
      metafile: true,
    });

    const esmResult = esbuild.buildSync({
      entryPoints: ['./src/index.js'],
      outdir: 'dist/esm',
      minify: true,
      bundle: true,
      format: 'esm',
      target: 'es6',
      external: [],
      metafile: true,
    });

    let esmSize = 0;
    Object.values(esmResult.metafile.outputs).forEach((output) => {
      esmSize += output.bytes;
    });

    fs.readFile('./dist/esm/index.js', (_err, data) => {
      gzip(data, (_err, result) => {
        console.log(
          `✔ ${name}: Built package. ${(esmSize / 1000).toFixed(2)}kb (${(
            result.length / 1000
          ).toFixed(2)}kb minified)`
        );
      });
    });
  } catch (e) {
    console.log(`× ${name}: Build failed due to an error.`);
    console.log(e);
  }
}

main();
