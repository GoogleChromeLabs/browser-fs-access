/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { fileOpen, directoryOpen, fileSave, supported } from '../src/index.js';

import { imageToBlob } from './image-to-blob.mjs';

(async () => {
  const openButton = document.querySelector('#open');
  const openMultipleButton = document.querySelector('#open-multiple');
  const openImageOrTextButton = document.querySelector('#open-image-or-text');
  const openDirectoryButton = document.querySelector('#open-directory');
  const saveButton = document.querySelector('#save');
  const saveBlobButton = document.querySelector('#save-blob');
  const saveResponseButton = document.querySelector('#save-response');
  const supportedParagraph = document.querySelector('.supported');
  const pre = document.querySelector('pre');

  const ABORT_MESSAGE = 'The user aborted a request.';

  if (supported) {
    supportedParagraph.textContent = 'Using the File System Access API.';
  } else {
    supportedParagraph.textContent = 'Using the fallback implementation.';
  }

  const appendImage = (blob) => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    document.body.append(img);
    img.onload = img.onerror = () => URL.revokeObjectURL(img.src);
  };

  const listDirectory = (blobs) => {
    let fileStructure = '';
    blobs
      .sort((a, b) => a.webkitRelativePath.localeCompare(b))
      .forEach((blob) => {
        // The File System Access API currently reports the `webkitRelativePath`
        // as empty string `''`.
        fileStructure += `${blob.webkitRelativePath}\n`;
      });
    pre.textContent += fileStructure;

    blobs
      .filter((blob) => {
        return blob.type.startsWith('image/');
      })
      .forEach((blob) => {
        appendImage(blob);
      });
  };

  openButton.addEventListener('click', async () => {
    try {
      const blob = await fileOpen({
        mimeTypes: ['image/jpg', 'image/png', 'image/gif', 'image/webp'],
        extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      });
      appendImage(blob);
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log(ABORT_MESSAGE);
    }
  });

  openMultipleButton.addEventListener('click', async () => {
    try {
      const blobs = await fileOpen({
        mimeTypes: ['image/jpg', 'image/png', 'image/gif', 'image/webp'],
        extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        multiple: true,
      });
      for (const blob of blobs) {
        appendImage(blob);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log(ABORT_MESSAGE);
    }
  });

  openImageOrTextButton.addEventListener('click', async () => {
    try {
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
      for (const blob of blobs) {
        if (blob.type.startsWith('image/')) {
          appendImage(blob);
        } else {
          document.body.append(await blob.text());
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log(ABORT_MESSAGE);
    }
  });

  openDirectoryButton.addEventListener('click', async () => {
    try {
      const blobs = await directoryOpen();
      listDirectory(blobs);
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log(ABORT_MESSAGE);
    }
  });

  saveButton.addEventListener('click', async () => {
    const blob = await imageToBlob(document.querySelector('img'));
    try {
      await fileSave(blob, {
        fileName: 'floppy.png',
        extensions: ['.png'],
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log(ABORT_MESSAGE);
    }
  });

  saveBlobButton.addEventListener('click', async () => {
    const blob = imageToBlob(document.querySelector('img'));
    try {
      await fileSave(blob, {
        fileName: 'floppy-blob.png',
        extensions: ['.png'],
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log(ABORT_MESSAGE);
    }
  });

  saveResponseButton.addEventListener('click', async () => {
    const response = await fetch('./floppy.png');
    try {
      await fileSave(response, {
        fileName: 'floppy-response.png',
        extensions: ['.png'],
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        return console.error(err);
      }
      console.log(ABORT_MESSAGE);
    }
  });

  openButton.disabled = false;
  openMultipleButton.disabled = false;
  openImageOrTextButton.disabled = false;
  openDirectoryButton.disabled = false;
  saveButton.disabled = false;
  saveBlobButton.disabled = false;
  saveResponseButton.disabled = false;
})();
