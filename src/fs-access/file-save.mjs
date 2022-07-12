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

const tryExistingHandle = async (handle, discontinue) => {
  try {
    await handle.getFile();
    return handle;
  } catch (error) {
    if (discontinue) throw error;
    return null;
  }
}

const getHandle = async (handle, options) => {
  if (handle) return handle;
  return await window.showSaveFilePicker(options)
};

const getType = (blob, response) => {
  const { type } = blob;
  if (type) return type;
  const { headers } = response;
  if (headers) return headers.get('content-type');
  return '';
};

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
  const opts = Array.isArray(options) ? options : [options];
  const blob = blobOrPromiseBlobOrResponse instanceof Blob ? blobOrPromiseBlobOrResponse : {};
  const response = blobOrPromiseBlobOrResponse;
  const type = getType(blob, response);
  const types = opts.map(({ description = 'Files', extensions = [], mimeTypes }) => {
    const accept = {};
    if (mimeTypes) {
      for (const mimeType of mimeTypes) {
        accept[mimeType] = extensions;
      }
    } else if (type) {
      accept[type] = extensions;
    } else {
      accept['*/*'] = extensions;
    }
    return { description, accept }
  });
  const [{ mimeTypes, extentions = [] }] = opts;
  const [{ accept }] = types;
  if (mimeTypes && type) {
    accept[type] = extentions;
  }

  const prevHandle = await tryExistingHandle(existingHandle, throwIfExistingHandleNotGood)
  const [{ fileName = 'Untitled', id, startIn, excludeAcceptAllOption = false }] = opts;
  const handleOptions = { suggestedName: fileName, id, startIn, types, excludeAcceptAllOption };
  const handle = await getHandle(prevHandle, handleOptions);
  if (!prevHandle && filePickerShown) {
    filePickerShown(handle);
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
  const contents = await blobOrPromiseBlobOrResponse;
  await writable.write(contents);
  await writable.close();
  return handle;
};
