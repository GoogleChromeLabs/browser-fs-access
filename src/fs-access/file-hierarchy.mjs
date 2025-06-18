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

import getFiles from './directory-open.mjs';

/**
 * Variant of (and largely delegates to) directory-open. Opens a directory from disk using the File System Access API.
 * Includes a reference to the directory which was opened, and therefore is not backward compatible with
 * `<input type webkitdirectory>`.
 *
 * @type { typeof import("../index").fileHierarchy }
 */
export default async (options = {}) => {
  options.recursive = options.recursive || false;
  options.mode = options.mode || 'read';
  const handle = await window.showDirectoryPicker({
    id: options.id,
    startIn: options.startIn,
    mode: options.mode,
  });
  const dirResults = getFiles(options);
  return {
    currentDir: handle,
    contents: dirResults,
  };
};
