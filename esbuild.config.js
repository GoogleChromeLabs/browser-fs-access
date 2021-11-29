import fs from 'fs';
import esbuild from 'esbuild';
import { gzip } from 'zlib';

const name = process.env.npm_package_name || '';

/**
 * Create an ESM and a CJS bundle for the given entry file.
 */
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
      target: 'es2020',
      external: [],
      metafile: true,
    });

    const esmResult = esbuild.buildSync({
      entryPoints: ['./src/index.js'],
      outdir: 'dist/esm',
      minify: true,
      bundle: true,
      format: 'esm',
      target: 'es2020',
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
  } catch (err) {
    console.log(`× ${name}: Build failed due to an error.`);
    console.log(err);
  }
}

main();
