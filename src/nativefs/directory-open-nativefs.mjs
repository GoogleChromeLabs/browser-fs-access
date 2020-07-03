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

const getFiles = async (dirHandle, recursive) => {
  const dirs = [];
  const files = [];
  for await (const entry of dirHandle.getEntries()) {
    if (entry.isFile) {
      files.push(entry.getFile());
    } else if (entry.isDirectory && recursive) {
      dirs.push(getFiles(entry, recursive));
    }
  }
  return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))];
};

/**
 * Opens a directory from disk using the Native File System API.
 * @param {Object} [options] - Optional options object.
 * @param {boolean} options.recursive - Whether to recursively get
 *     subdirectories.
 * @param {boolean} options.multiple - Allow multiple directories to be
 *     selected.
 * @return {File[]} Contained files.
 */
export default async (options = {}) => {
  options.recursive = options.recursive || false;
  options.multiple = options.multiple || false;
  const handleOrHandles = await window.chooseFileSystemEntries({
    type: 'open-directory',
    multiple: options.multiple,
  });
  if (options.multiple) {
    return (
      await Promise.all(
          handleOrHandles.map((handle) => getFiles(handle, options.recursive)),
      )
    ).flat();
  }
  return getFiles(handleOrHandles, options.recursive);
};
