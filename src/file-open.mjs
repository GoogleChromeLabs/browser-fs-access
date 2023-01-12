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

import supported from './supported.mjs';

const implementation = supported
  ? import('./fs-access/file-open.mjs')
  : import('./legacy/file-open.mjs');

/**
 * For opening files, dynamically either loads the File System Access API module
 * or the legacy method.
 */
export async function fileOpen(...args) {
  return (await implementation).default(...args);
}
