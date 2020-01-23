# Browser-NativeFS

This module allows you to easily use the
[Native File System API](https://wicg.github.io/native-file-system/) on supporting browsers,
with a transparent fallback to the `<input type="file">` and `<a download>` legacy methods.

Read more on the background of this module in my post
[Progressive Enhancement In the Age of Fugu APIs](https://blog.tomayac.com/2020/01/23/progressive-enhancement-in-the-age-of-fugu-apis/).

## Usage Example

The module feature-detects support for the Native File System API and
only loads the actually relevant code.

```js
// The imported methods will use the Native File System API or a fallback implementation.
import {
  fileOpen,
  fileSave,
} from 'https://unpkg.com/browser-nativefs';

(async () => {
  // Open a file.
  const blob = await fileOpen({
    mimeTypes: ['image/*'],
  });

  // Open multiple files.
  const blobs = await fileOpen({
    mimeTypes: ['image/*'],
    multiple: true,
  });

  // Save a file.
  await fileSave(blob, {
    fileName: 'Untitled.png',
  });
})();
```

## API Documentation

Opening files:

```js
// Options are optional.
const options = {
  // List of allowed MIME types, defaults to `*/*`.
  mimeTypes: ['image/*'],
  // List of allowed file extensions, defaults to `''`.
  extensions: ['png', 'jpg', 'jpeg', 'webp'],
  // Set to `true` for allowing multiple files, defaults to `false`.
  multiple: true,
  // Textual description for file dialog , defaults to `''`.
  description: 'Image files',
};

const blobs = await fileOpen(options);
```

Saving files:

```js
// Options are optional.
const options = {
   // Suggested file name to use, defaults to `''`.
  fileName: 'Untitled.txt',
};

// Optional file handle to save back to an existing file.
// This will only work with the Native File System API.
// Get a `FileHandle` from the `handle` property of the `Blob`
// you receive from `fileOpen()` (this is non-standard).
const handle = previouslyOpenedBlob.handle;

await fileSave(someBlob, options, handle);
```

## Acknowledgements

Thanks to @developit for improving the dynamic module loading.

## License

Apache 2.0.
