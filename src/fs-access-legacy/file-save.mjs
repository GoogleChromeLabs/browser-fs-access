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
 * Saves a file to disk using the (legacy) File System Access API.
 * @type { typeof import("../../index").fileSave }
 */
export default async (blob, options = {}, handle = null) => {
  options.fileName = options.fileName || 'Untitled';
  handle =
    handle ||
    (await window.chooseFileSystemEntries({
      type: 'save-file',
      accepts: [
        {
          description: options.description || '',
          mimeTypes: [blob.type],
          extensions: options.extensions || [''],
        },
      ],
    }));
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
  return handle;
};
