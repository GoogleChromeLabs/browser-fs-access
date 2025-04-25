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
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.

/**
 * Opens a directory from disk using the legacy
 * `<input type="file" webkitdirectory>` method.
 * @type { typeof import("../index").directoryOpen }
 */
export default async (options = [{}]) => {
  if (!Array.isArray(options)) {
    options = [options];
  }
  options[0].recursive = options[0].recursive || false;
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    // Append to the DOM, else Safari on iOS won't fire the `change` event
    // reliably.
    input.style.display = 'none';
    document.body.append(input);

    input.addEventListener('cancel', () => {
      input.remove();
      reject(new DOMException('The user aborted a request.', 'AbortError'));
    });

    input.addEventListener('change', () => {
      input.remove();
      let files = Array.from(input.files);
      if (!options[0].recursive) {
        files = files.filter((file) => {
          return file.webkitRelativePath.split('/').length === 2;
        });
      } else if (options[0].recursive && options[0].skipDirectory) {
        files = files.filter((file) => {
          const directoriesName = file.webkitRelativePath.split('/');
          return directoriesName.every(
            (directoryName) =>
              !options[0].skipDirectory({
                name: directoryName,
                kind: 'directory',
              })
          );
        });
      }

      resolve(files);
    });
    if ('showPicker' in HTMLInputElement.prototype) {
      input.showPicker();
    } else {
      input.click();
    }
  });
};
