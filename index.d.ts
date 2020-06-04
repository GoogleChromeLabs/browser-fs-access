export function fileOpen(options?: {
  mimeTypes?: string[],
  extensions?: string[],
  description?: string,
  multiple: true,
}): Promise<File[]>;

export function fileOpen(options?: {
  mimeTypes?: string[],
  extensions?: string[],
  description?: string,
  multiple?: false,
}): Promise<File>;

export interface FileSaveOptions {
  mimeTypes: string[],
  extensions: string[],
  multiple: boolean,
  description: string,
}

export function fileSave(blob: Blob, options?: FileSaveOptions, handle?: FileSystemHandle | null): Promise<FileSystemHandle>;

export interface DirectoryOpenOptions {
  recursive: boolean,
  multiple: boolean,
}

export function directoryOpen(options?: DirectoryOpenOptions): Promise<File[]>;

export function imageToBlob(img: HTMLImageElement): Promise<Blob>;

// The following typings implement the relevant parts of the Native File System API.
// This can be removed once the specification reaches the Candidate phase and is
// implemented as part of microsoft/TSJS-lib-generator.

export interface FileSystemHandlePermissionDescriptor {
  writable: boolean,
}

export interface FileSystemHandle {
  readonly isFile: boolean,
  readonly isDirectory: boolean,
  readonly name: string,

  isSameEntry: (other: FileSystemHandle) => Promise<boolean>,

  queryPermission: (descriptor?: FileSystemHandlePermissionDescriptor) => Promise<PermissionState>,
  requestPermission: (descriptor?: FileSystemHandlePermissionDescriptor) => Promise<PermissionState>,
}
