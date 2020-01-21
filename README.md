# Browser-NativeFS

Use the [Native File System API](https://wicg.github.io/native-file-system/)
with legacy fallback in the browser.

## Usage

```js
import {
  fileOpenPromise,
  fileSavePromise,
  imageToBlob
} from 'https://unpkg.com/browser-nativefs';

(async () => {
  const fileOpen = (await fileOpenPromise).default;
  const fileSave = (await fileSavePromise).default;

  const openButton = document.querySelector('#open');
  const saveButton = document.querySelector('#save');

  openButton.addEventListener('click', async (e) => {
    try {
      const blob = await fileOpen({mimeTypes: ['image/*']});
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      document.body.append(img);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    }
  });

  saveButton.addEventListener('click', async (e) => {
    const blob = await imageToBlob(document.querySelector('img'));
    try {
      await fileSave(blob, {fileName: 'Untitled.png'});
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    }
  });

  openButton.disabled = false;
  saveButton.disabled = false;
})();
```

## API

```js
const options = {
  mimeTypes: ['*/*'],
};
const blob = await fileOpen(options);
```

```js
const options = {
  fileName: 'untitled.txt',
};
await fileSave(blob, options);
```

## License

Apache 2.0.
