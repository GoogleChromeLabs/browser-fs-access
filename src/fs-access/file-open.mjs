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

const getFileWithHandle = async (handle) => {
  const file = await handle.getFile();
  file.handle = handle;
  return file;
};

/**
 * Opens a file from disk using the File System Access API.
 * @type { typeof import("../../index").fileOpen }
 */
export default async (options = [{}]) => {
  const opts = Array.isArray(options) ? options : [options];
  const types = opts.map(({ description = 'Files', extensions = [], mimeTypes }) => {
    const accept = {};
    if (mimeTypes) {
      for (const mimeType of mimeTypes) {
        accept[mimeType] = extensions;
      }
    } else {
      accept['*/*'] = extensions;
    }
    return { description, accept };
  });
  const [{ id, startIn, multiple = false, excludeAcceptAllOption = false }] = opts;
  const handleOrHandles = await window.showOpenFilePicker({
    id,
    startIn,
    types,
    multiple,
    excludeAcceptAllOption,
  });
  const files = await Promise.all(handleOrHandles.map(getFileWithHandle));
  if (multiple) return files;
  return files[0];
};
