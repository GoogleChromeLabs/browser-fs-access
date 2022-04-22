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
 * Saves a file to disk using the File System Access API.
 * @type { typeof import("../../index").fileSave }
 */
export default async (
  blobOrPromiseBlobOrResponse,
  options = [{}],
  existingHandle = null,
  throwIfExistingHandleNotGood = false,
  filePickerShown = null
) => {
  if (!Array.isArray(options)) {
    options = [options];
  }
  options[0].fileName = options[0].fileName || 'Untitled';
  const types = [];
  let type = null;
  if (
    blobOrPromiseBlobOrResponse instanceof Blob &&
    blobOrPromiseBlobOrResponse.type
  ) {
    type = blobOrPromiseBlobOrResponse.type;
  } else if (
    blobOrPromiseBlobOrResponse.headers &&
    blobOrPromiseBlobOrResponse.headers.get('content-type')
  ) {
    type = blobOrPromiseBlobOrResponse.headers.get('content-type');
  }
  options.forEach((option, i) => {
    types[i] = {
      description: option.description || '',
      accept: {},
    };
    if (option.mimeTypes) {
      if (i === 0 && type) {
        option.mimeTypes.push(type);
      }
      option.mimeTypes.map((mimeType) => {
        types[i].accept[mimeType] = option.extensions || [];
      });
    } else if (type) {
      types[i].accept[type] = option.extensions || [];
    }
  });
  if (existingHandle) {
    try {
      // Check if the file still exists.
      await existingHandle.getFile();
    } catch (err) {
      existingHandle = null;
      if (throwIfExistingHandleNotGood) {
        throw err;
      }
    }
  }
  const handle =
    existingHandle ||
    (await window.showSaveFilePicker({
      suggestedName: options[0].fileName,
      id: options[0].id,
      startIn: options[0].startIn,
      types,
      excludeAcceptAllOption: options[0].excludeAcceptAllOption || false,
    }));
  if (!existingHandle && filePickerShown) {
    filePickerShown();
  }
  const writable = await handle.createWritable();
  // Use streaming on the `Blob` if the browser supports it.
  if ('stream' in blobOrPromiseBlobOrResponse) {
    const stream = blobOrPromiseBlobOrResponse.stream();
    await stream.pipeTo(writable);
    return handle;
    // Handle passed `ReadableStream`.
  } else if ('body' in blobOrPromiseBlobOrResponse) {
    await blobOrPromiseBlobOrResponse.body.pipeTo(writable);
    return handle;
  }
  // Default case of `Blob` passed and `Blob.stream()` not supported.
  await writable.write(await blobOrPromiseBlobOrResponse);
  await writable.close();
  return handle;
};
