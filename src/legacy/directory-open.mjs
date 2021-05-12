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
 * Opens a directory from disk using the legacy
 * `<input type="file" webkitdirectory>` method.
 * @type { typeof import("../../index").directoryOpen }
 */
export default async (options = {}) => {
  options.recursive = options.recursive || false;
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;

    // ToDo: Remove this workaround once
    // https://github.com/whatwg/html/issues/6376 is specified and supported.
    let cleanupListenersAndMaybeReject;
    const rejectionHandler = () => cleanupListenersAndMaybeReject(reject);
    if (options.setupLegacyCleanupAndRejection) {
      cleanupListenersAndMaybeReject =
        options.setupLegacyCleanupAndRejection(rejectionHandler);
    } else {
      // Default rejection behavior; works in most cases, but not in Chrome in non-secure contexts.
      cleanupListenersAndMaybeReject = (reject) => {
        window.removeEventListener('pointermove', rejectionHandler);
        window.removeEventListener('pointerdown', rejectionHandler);
        window.removeEventListener('keydown', rejectionHandler);
        if (reject) {
          reject(new DOMException('The user aborted a request.', 'AbortError'));
        }
      };

      window.addEventListener('pointermove', rejectionHandler);
      window.addEventListener('pointerdown', rejectionHandler);
      window.addEventListener('keydown', rejectionHandler);
    }

    input.addEventListener('change', () => {
      cleanupListenersAndMaybeReject();
      let files = Array.from(input.files);
      if (!options.recursive) {
        files = files.filter((file) => {
          return file.webkitRelativePath.split('/').length === 2;
        });
      }
      resolve(files);
    });

    input.click();
  });
};
