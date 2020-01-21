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

import {fileOpenPromise, fileSavePromise} from '../dist/nativefs.mjs'
import imageToBlob from '../src/image-to-blob.mjs';

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
