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
 * Opens a file from disk using the legacy `<input type="file">` method.
 * @type { typeof import("../index").fileOpen }
 */
export default async (options = [{}]) => {
  if (!Array.isArray(options)) {
    options = [options];
  }
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    const accept = [
      ...options.map((option) => option.mimeTypes || []),
      ...options.map((option) => option.extensions || []),
    ].join();
    input.multiple = options[0].multiple || false;
    // Empty string allows everything.
    input.accept = accept || '';
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
      resolve(input.multiple ? Array.from(input.files) : input.files[0]);
    });

    if ('showPicker' in HTMLInputElement.prototype) {
      input.showPicker();
    } else {
      input.click();
    }
  });
};
