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
 * Opens a file from disk using the Native File System API.
 * @param {Object} [options] - Optional options object.
 * @param {string[]} options.mimeTypes - Acceptable MIME types.
 * @param {string[]} options.extensions - Acceptable file extensions.
 * @param {boolean} options.multiple - Allow multiple files to be selected.
 * @param {string} options.description - Suggested file description.
 * @return {File | File[]} Opened file(s).
 */
export default async (options = {}) => {
  try {
    const handleOrHandles = await window.chooseFileSystemEntries({
      accepts: [
        {
          description: options.description || '',
          mimeTypes: options.mimeTypes || ['*/*'],
          extensions: options.extensions || [''],
        },
      ],
      multiple: options.multiple || false,
    });
    if (options.multiple) {
      const files = [];
      for (const handle of handleOrHandles) {
        const file = await handle.getFile();
        // TODO: is this good practice?
        file.handle = handle;
        files.push(file);
      }
      return files;
    }
    const file = await handleOrHandles.getFile();
    // TODO: is this good practice?
    file.handle = handleOrHandles;
    return file;
  } catch (err) {
    throw err;
  }
};
