/**
 * Properties shared by all `options` provided to file save and open operations
 */
export interface CoreFileOptions {
  /** Acceptable file extensions. Defaults to [""]. */
  extensions?: string[];
  /** Suggested file description. Defaults to "". */
  description?: string;
  /** Acceptable MIME types. [] */
  mimeTypes?: string[];
}

/**
 * Properties shared by the _first_ `options` object provided to file save and
 * open operations (any additional options objects provided to those operations
 * cannot have these properties)
 */
export interface FirstCoreFileOptions extends CoreFileOptions {
  startIn?: WellKnownDirectory | FileSystemHandle;
  /** By specifying an ID, the user agent can remember different directories for different IDs. */
  id?: string;
  excludeAcceptAllOption?: boolean | false;
}

/**
 * The first `options` object passed to file save operations can also specify
 * a filename
 */
export interface FirstFileSaveOptions extends FirstCoreFileOptions {
  /** Suggested file name. Defaults to "Untitled". */
  fileName?: string;
}

/**
 * The first `options` object passed to file open operations can specify
 * whether multiple files can be selected (the return type of the operation
 * will be updated appropriately) and a way of handling cleanup and rejection
 * for legacy open operations.
 */
export interface FirstFileOpenOptions<M extends boolean | undefined>
  extends FirstCoreFileOptions {
  /** Allow multiple files to be selected. Defaults to false. */
  multiple?: M;
  /**
   * Configurable cleanup and `Promise` rejector usable with legacy API for
   * determining when (and reacting if) a user cancels the operation. The
   * method will be passed a reference to the internal `rejectionHandler` that
   * can, e.g., be attached to/removed from the window or called after a
   * timeout. The method should return a function that will be called when
   * either the user chooses to open a file or the `rejectionHandler` is
   * called. In the latter case, the returned function will also be passed a
   * reference to the `reject` callback for the `Promise` returned by
   * `fileOpen`, so that developers may reject the `Promise` when desired at
   * that time.
   * Example rejector:
   *
   * const file = await fileOpen({
   *   setupLegacyCleanupAndRejection: (rejectionHandler) => {
   *     const timeoutId = setTimeout(rejectionHandler, 10_000);
   *     return (reject) => {
   *       clearTimeout(timeoutId);
   *       if (reject) {
   *         reject('My error message here.');
   *       }
   *     };
   *   },
   * });
   *
   * ToDo: Remove this workaround once
   *   https://github.com/whatwg/html/issues/6376 is specified and supported.
   */
  setupLegacyCleanupAndRejection?: (
    rejectionHandler?: () => void
  ) => (reject: (reason?: any) => void) => void;
}

/**
 * Opens file(s) from disk.
 */
export function fileOpen<M extends boolean | undefined = false>(
  options?:
    | [FirstFileOpenOptions<M>, ...CoreFileOptions[]]
    | FirstFileOpenOptions<M>
): M extends false | undefined
  ? Promise<FileWithHandle>
  : Promise<FileWithHandle[]>;

export type WellKnownDirectory =
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos';

/**
 * Saves a file to disk.
 * @returns Optional file handle to save in place.
 */
export function fileSave(
  /** To-be-saved blob */
  blob: Blob,
  options?: [FirstFileSaveOptions, ...CoreFileOptions[]] | FirstFileSaveOptions,
  /**
   * A potentially existing file handle for a file to save to. Defaults to
   * null.
   */
  existingHandle?: FileSystemHandle | null,
  /**
   * Determines whether to throw (rather than open a new file save dialog)
   * when existingHandle is no longer good. Defaults to false.
   */
  throwIfExistingHandleNotGood?: boolean | false
): Promise<FileSystemHandle>;

/**
 * Opens a directory from disk using the File System Access API.
 * @returns Contained files.
 */
export function directoryOpen(options?: {
  /** Whether to recursively get subdirectories. */
  recursive: boolean;
  /** Suggested directory in which the file picker opens. */
  startIn?: WellKnownDirectory | FileSystemHandle;
  /** By specifying an ID, the user agent can remember different directories for different IDs. */
  id?: string;
  /**
   * Configurable cleanup and `Promise` rejector usable with legacy API for
   * determining when (and reacting if) a user cancels the operation. The
   * method will be passed a reference to the internal `rejectionHandler` that
   * can, e.g., be attached to/removed from the window or called after a
   * timeout. The method should return a function that will be called when
   * either the user chooses to open a file or the `rejectionHandler` is
   * called. In the latter case, the returned function will also be passed a
   * reference to the `reject` callback for the `Promise` returned by
   * `fileOpen`, so that developers may reject the `Promise` when desired at
   * that time.
   * Example rejector:
   *
   * const file = await directoryOpen({
   *   setupLegacyCleanupAndRejection: (rejectionHandler) => {
   *     const timeoutId = setTimeout(rejectionHandler, 10_000);
   *     return (reject) => {
   *       clearTimeout(timeoutId);
   *       if (reject) {
   *         reject('My error message here.');
   *       }
   *     };
   *   },
   * });
   *
   * ToDo: Remove this workaround once
   *   https://github.com/whatwg/html/issues/6376 is specified and supported.
   */
  setupLegacyCleanupAndRejection?: (
    rejectionHandler?: () => void
  ) => (reject: (reason?: any) => void) => void;
}): Promise<FileWithDirectoryHandle[]>;

/**
 * Whether the File System Access API is supported.
 */
export const supported: boolean;

export function imageToBlob(img: HTMLImageElement): Promise<Blob>;

export interface FileWithHandle extends File {
  handle?: FileSystemHandle;
}

export interface FileWithDirectoryHandle extends File {
  directoryHandle?: FileSystemHandle;
}

// The following typings implement the relevant parts of the File System Access
// API. This can be removed once the specification reaches the Candidate phase
// and is implemented as part of microsoft/TSJS-lib-generator.

export interface FileSystemHandlePermissionDescriptor {
  mode?: 'read' | 'readwrite';
}

export interface FileSystemHandle {
  readonly kind: 'file' | 'directory';
  readonly name: string;

  isSameEntry: (other: FileSystemHandle) => Promise<boolean>;

  queryPermission: (
    descriptor?: FileSystemHandlePermissionDescriptor
  ) => Promise<PermissionState>;
  requestPermission: (
    descriptor?: FileSystemHandlePermissionDescriptor
  ) => Promise<PermissionState>;
}
