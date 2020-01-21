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

export default async (blob, options = {}, handle = null) => {
  try {
    handle = handle || await chooseFileSystemEntries({
      type: 'saveFile',
      accepts: [
        {
          description: options.description ||
              `${blob.type.split('/')[0][0].toUpperCase()}${
                blob.type.split('/')[0].substr(1)} file`,
          mimeTypes: options.mimeTypes || [blob.type],
          extensions: [options.fileName.substr(
              options.fileName.lastIndexOf('.') + 1)],
        },
      ],
    });
    const writer = await handle.createWriter();
    await writer.truncate(0);
    await writer.write(0, blob);
    await writer.close();
  } catch (err) {
    throw err;
  }
};
