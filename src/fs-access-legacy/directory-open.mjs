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

const getFiles = async (dirHandle, recursive, path = dirHandle.name) => {
  const dirs = [];
  const files = [];
  for await (const entry of dirHandle.getEntries()) {
    const nestedPath = `${path}/${entry.name}`;
    if (entry.isFile) {
      files.push(
        entry.getFile().then((file) =>
          Object.defineProperty(file, 'webkitRelativePath', {
            configurable: true,
            enumerable: true,
            get: () => nestedPath,
          })
        )
      );
    } else if (entry.isDirectory && recursive) {
      dirs.push(getFiles(entry, recursive, nestedPath));
    }
  }
  return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))];
};

/**
 * Opens a directory from disk using the (legacy) File System Access API.
 * @type { typeof import("../../index").directoryOpen }
 */
export default async (options = {}) => {
  options.recursive = options.recursive || false;
  const handle = await window.chooseFileSystemEntries({
    type: 'open-directory',
  });
  return getFiles(handle, options.recursive);
};
