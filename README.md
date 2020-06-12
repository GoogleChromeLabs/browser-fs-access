# Browser-NativeFS

This module allows you to easily use the
[Native File System API](https://wicg.github.io/native-file-system/) on supporting browsers,
with a transparent fallback to the `<input type="file">` and `<a download>` legacy methods.

Read more on the background of this module in my post
[Progressive Enhancement In the Age of Fugu APIs](https://blog.tomayac.com/2020/01/23/progressive-enhancement-in-the-age-of-fugu-apis/).

## Live Demo

See the library in action: https://browser-nativefs.glitch.me/.

## Origin Trial

⚠️ In order to use the Native File System API, you need to quickly
[request an origin trial token](https://developers.chrome.com/origintrials/#/view_trial/4019462667428167681)
for your application and
[communicate](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin) it to the browser via a meta tag or an HTTP header.

## Usage Example

The module feature-detects support for the Native File System API and
only loads the actually relevant code.

```js
// The imported methods will use the Native
// File System API or a fallback implementation.
import {
  fileOpen,
  directoryOpen,
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

  // Open all files in a directory,
  // recursively including subdirectories.
  const blobsInDirectory = await directoryOpen({
    recursive: true
  });

  // Save a file.
  await fileSave(blob, {
    fileName: 'Untitled.png',
  });
})();
```

## API Documentation

### Opening files:

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

### Opening directories:

Note that there are some differences between the Native File System API
and the fallback approach
[`<input type="file" webkitdirectory multiple>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory).
Namely, the Native File System API currently doesn't provide useful
relative path info as
[`webkitRelativePath`](https://developer.mozilla.org/en-US/docs/Web/API/File/webkitRelativePath)
did, so you need to keep track of paths yourself.

```js
// Options are optional.
const options = {
  // Set to `true` for allowing multiple directories, defaults to `false`.
  multiple: true,
  // Set to `true` to recursively open files in all subdirectories,
  // defaults to `false`.
  recursive: true,
};

const blobs = await directoryOpen(options);
```

### Saving files:

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

## Browser-NativeFS in Action

You can see the module in action in the [Excalidraw](https://excalidraw.com/) drawing app.

![excalidraw](https://user-images.githubusercontent.com/145676/73060246-b4a64200-3e97-11ea-8f70-fa5edd63f78e.png)

## Alternatives

A similar, but more extensive library called
[native-file-system-adapter](https://github.com/jimmywarting/native-file-system-adapter/)
is provided by [@jimmywarting](https://github.com/jimmywarting).

## Acknowledgements

Thanks to [@developit](https://github.com/developit)
for improving the dynamic module loading
and [@dwelle](https://github.com/dwelle) for the helpful feedback
and issue reports.
The TypeScript type annotations were provided by
[@nanaian](https://github.com/nanaian).

## License and Note

Apache 2.0.

This is not an official Google product.
