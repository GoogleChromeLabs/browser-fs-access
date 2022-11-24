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
 * @module browser-fs-access
 */
export { fileOpen } from './file-open.mjs';
export { directoryOpen } from './directory-open.mjs';
export { fileSave } from './file-save.mjs';
export { fileHierarchy } from './file-hierarchy.mjs';

export { default as fileOpenModern } from './fs-access/file-open.mjs';
export { default as directoryOpenModern } from './fs-access/directory-open.mjs';
export { default as fileSaveModern } from './fs-access/file-save.mjs';

export { default as fileOpenLegacy } from './legacy/file-open.mjs';
export { default as directoryOpenLegacy } from './legacy/directory-open.mjs';
export { default as fileSaveLegacy } from './legacy/file-save.mjs';

export { default as supported } from './supported.mjs';
