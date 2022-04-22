# Browser-FS-Access

This module allows you to easily use the
[File System Access API](https://wicg.github.io/file-system-access/) on supporting browsers,
with a transparent fallback to the `<input type="file">` and `<a download>` legacy methods.
This library is a [ponyfill](https://ponyfill.com/).

Read more on the background of this module in my post
[Progressive Enhancement In the Age of Fugu APIs](https://blog.tomayac.com/2020/01/23/progressive-enhancement-in-the-age-of-fugu-apis/).

## Live Demo

Try the library in your browser: https://googlechromelabs.github.io/browser-fs-access/demo/.

## Installation

You can install the module with npm.

```bash
npm install --save browser-fs-access
```

## Usage Example

The module feature-detects support for the File System Access API and
only loads the actually relevant code.

```js
// The imported methods will use the File System
// Access API or a fallback implementation.
import {
  fileOpen,
  directoryOpen,
  fileSave,
  supported,
} from 'https://unpkg.com/browser-fs-access';

(async () => {
  if (supported) {
    console.log('Using the File System Access API.');
  } else {
    console.log('Using the fallback implementation.');
  }

  // Open a file.
  const blob = await fileOpen({
    mimeTypes: ['image/*'],
  });

  // Open multiple files.
  const blobs = await fileOpen({
    mimeTypes: ['image/*'],
    multiple: true,
  });

  // Open files of different MIME types.
  const blobs = await fileOpen([
    {
      description: 'Image files',
      mimeTypes: ['image/jpg', 'image/png', 'image/gif', 'image/webp'],
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      multiple: true,
    },
    {
      description: 'Text files',
      mimeTypes: ['text/*'],
      extensions: ['.txt'],
    },
  ]);

  // Open all files in a directory,
  // recursively including subdirectories.
  const blobsInDirectory = await directoryOpen({
    recursive: true,
  });

  // Save a file.
  await fileSave(blob, {
    fileName: 'Untitled.png',
    extensions: ['.png'],
  });

  // Save a `Response` that will be streamed.
  const response = await fetch('foo.png');
  await fileSave(response, {
    fileName: 'foo.png',
    extensions: ['.png'],
  });

  // Save a `Promise<Blob>` that will be streamed.
  // No need to `await` the `Blob` to be created.
  const blob = createBlobAsyncWhichMightTakeLonger(someData);
  await fileSave(response, {
    fileName: 'Untitled.png',
    extensions: ['.png'],
  });
})();
```

## API Documentation

### Opening files:

```js
// Options are optional. You can pass an array of options, too.
const options = {
  // List of allowed MIME types, defaults to `*/*`.
  mimeTypes: ['image/*'],
  // List of allowed file extensions (with leading '.'), defaults to `''`.
  extensions: ['.png', '.jpg', '.jpeg', '.webp'],
  // Set to `true` for allowing multiple files, defaults to `false`.
  multiple: true,
  // Textual description for file dialog , defaults to `''`.
  description: 'Image files',
  // Suggested directory in which the file picker opens. A well-known directory or a file handle.
  startIn: 'downloads',
  // By specifying an ID, the user agent can remember different directories for different IDs.
  id: 'projects',
  // Include an option to not apply any filter in the file picker, defaults to `false`.
  excludeAcceptAllOption: true,
};

const blobs = await fileOpen(options);
```

### Opening directories:

```js
// Options are optional.
const options = {
  // Set to `true` to recursively open files in all subdirectories,
  // defaults to `false`.
  recursive: true,
  // Suggested directory in which the file picker opens. A well-known directory or a file handle.
  startIn: 'downloads',
  // By specifying an ID, the user agent can remember different directories for different IDs.
  id: 'projects',
  // Callback to determine whether a directory should be entered, return `true` to skip.
  skipDirectory: (entry) => entry.name[0] === '.',
};

const blobs = await directoryOpen(options);
```

The module also polyfills a [`webkitRelativePath`](https://developer.mozilla.org/en-US/docs/Web/API/File/webkitRelativePath) property on returned files in a consistent way, regardless of the underlying implementation.

### Saving files:

```js
// Options are optional. You can pass an array of options, too.
const options = {
  // Suggested file name to use, defaults to `''`.
  fileName: 'Untitled.txt',
  // Suggested file extensions (with leading '.'), defaults to `''`.
  extensions: ['.txt'],
  // Suggested directory in which the file picker opens. A well-known directory or a file handle.
  startIn: 'downloads',
  // By specifying an ID, the user agent can remember different directories for different IDs.
  id: 'projects',
  // Include an option to not apply any filter in the file picker, defaults to `false`.
  excludeAcceptAllOption: true,
};

// Optional file handle to save back to an existing file.
// This will only work with the File System Access API.
// Get a `FileHandle` from the `handle` property of the `Blob`
// you receive from `fileOpen()` (this is non-standard).
const existingHandle = previouslyOpenedBlob.handle;

// Optional flag to determine whether to throw (rather than open a new file
// save dialog) when `existingHandle` is no longer good, for example, because
// the underlying file was deleted. Defaults to `false`.
const throwIfExistingHandleNotGood = true;

// `blobOrPromiseBlobOrResponse` is a `Blob`, a `Promise<Blob>`, or a `Response`.
await fileSave(
  blobOrResponseOrPromiseBlob,
  options,
  existingHandle,
  throwIfExistingHandleNotGood
);
```

### File operations and exceptions

The File System Access API supports exceptions, so apps can throw when problems occur (permissions
not granted, out of disk space,…), or when the user cancels the dialog. The legacy methods,
unfortunately, do not support exceptions (albeit there is an
[HTML issue](https://github.com/whatwg/html/issues/6376) open for this request). If your app depends
on exceptions, see the file
[`index.d.ts`](https://github.com/GoogleChromeLabs/browser-fs-access/blob/main/index.d.ts) for the
documentation of the `legacySetup` parameter.

## Browser-FS-Access in Action

You can see the module in action in the [Excalidraw](https://excalidraw.com/) drawing app.

![excalidraw](https://user-images.githubusercontent.com/145676/73060246-b4a64200-3e97-11ea-8f70-fa5edd63f78e.png)

It also powers the [SVGcode](https://svgco.de/) app that converts raster images to SVGs.

![svgcode](https://github.com/tomayac/SVGcode/raw/main/public/screenshots/desktop.png)

## Alternatives

A similar, but more extensive library called
[native-file-system-adapter](https://github.com/jimmywarting/native-file-system-adapter/)
is provided by [@jimmywarting](https://github.com/jimmywarting).

## Ecosystem

If you are looking for a similar solution for dragging and dropping of files,
check out [@placemarkio/flat-drop-files](https://github.com/placemark/flat-drop-files).

## Acknowledgements

Thanks to [@developit](https://github.com/developit)
for improving the dynamic module loading
and [@dwelle](https://github.com/dwelle) for the helpful feedback,
issue reports, and the Windows build fix.
Directory operations were made consistent regarding `webkitRelativePath`
and parallelized and sped up significantly by
[@RReverser](https://github.com/RReverser).
The TypeScript type annotations were initially provided by
[@nanaian](https://github.com/nanaian).
Dealing correctly with cross-origin iframes was contributed by
[@nikhilbghodke](https://github.com/nikhilbghodke) and
[@kbariotis](https://github.com/kbariotis).
The exception handling of the legacy methods was contributed by
[@jmrog](https://github.com/jmrog).
The streams and blob saving was improved by [@tmcw](https://github.com/tmcw).

## License and Note

Apache 2.0.

This is not an official Google product.
