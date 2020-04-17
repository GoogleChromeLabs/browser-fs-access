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

const getHandle = async (blob, options) => {
  try {
    return await window.chooseFileSystemEntries({
      type: 'save-file',
      accepts: [
        {
          description: options.description || '',
          mimeTypes: [blob.type],
        },
      ],
    });
  } catch (err) {
    // This is only temporarily necessary until Chrome 80 is fully gone.
    // https://github.com/WICG/native-file-system/issues/147
    if (err.name === 'TypeError') {
      try {
        return await window.chooseFileSystemEntries({
          type: 'saveFile',
          accepts: [
            {
              description: options.description || '',
              mimeTypes: [blob.type],
            },
          ],
        });
      } catch (err) {
        throw err;
      }
    }
    throw err;
  }
};

const writeBlob = async (handle, blob) => {
  try {
    // This is only temporarily necessary until Chrome 81 is fully gone.
    // https://wicg.github.io/native-file-system/#ref-for-dom-filesystemfilehandle-createwritable①:~:text=In%20the%20Origin%20Trial%20as%20available%20in%20Chrome%2082%2C%20createWritable%20replaces%20the%20createWriter%20method.
    if ('createWriter' in handle) {
      const writer = await handle.createWriter();
      await writer.truncate(0);
      await writer.write(0, blob);
      await writer.close();
    } else {
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Saves a file to disk using the Native File System API.
 * @param {Blob} blob - To-be-saved blob.
 * @param {Object} [options] - Optional options object.
 * @param {string} options.fileName - Suggested file name.
 * @param {string} options.description - Suggested file description.
 * @param {FileSystemHandle} [handle] - Optional file handle to save in place.
 */
export default async (blob, options = {}, handle = null) => {
  try {
    options.fileName = options.fileName || 'Untitled';
    handle = handle || await getHandle(blob, options);
    await writeBlob(handle, blob);
  } catch (err) {
    throw err;
  }
};
