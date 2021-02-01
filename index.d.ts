/**
 * Opens file(s) from disk.
 */
export function fileOpen<M extends boolean | undefined = false>(options?: {
  /** Acceptable MIME types. [] */
  mimeTypes?: string[];
  /** Acceptable file extensions. Defaults to "". */
  extensions?: string[];
  /** Suggested file description. Defaults to "". */
  description?: string;
  /** Allow multiple files to be selected. Defaults to false. */
  multiple?: M;
}): M extends false | undefined
  ? Promise<FileWithHandle>
  : Promise<FileWithHandle[]>;

/**
 * Saves a file to disk.
 * @returns Optional file handle to save in place.
 */
export function fileSave(
  /** To-be-saved blob */
  blob: Blob,
  options?: {
    /** Suggested file name. Defaults to "Untitled". */
    fileName?: string;
    /** Suggested file extensions. Defaults to [""]. */
    extensions?: string[];
    /** Suggested file description. Defaults to "". */
    description?: string;
  },
  handle?: FileSystemHandle | null
): Promise<FileSystemHandle>;

/**
 * Opens a directory from disk using the File System Access API.
 * @returns Contained files.
 */
export function directoryOpen(options?: {
  /** Whether to recursively get subdirectories. */
  recursive: boolean;
}): Promise<File[]>;

export function imageToBlob(img: HTMLImageElement): Promise<Blob>;

export interface FileWithHandle extends File {
  handle?: FileSystemHandle;
}

// The following typings implement the relevant parts of the File System Access API.
// This can be removed once the specification reaches the Candidate phase and is
// implemented as part of microsoft/TSJS-lib-generator.

export interface FileSystemHandlePermissionDescriptor {
  fileSystemHandle: FileSystemHandle;
  mode: 'read' | 'readWrite';
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
