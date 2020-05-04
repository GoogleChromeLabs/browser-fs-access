export interface FileOpenOptions {
  mimeTypes: string[],
  extensions: string[],
  multiple: boolean,
  description: string,
}

export function fileOpen(options?: FileOpenOptions): Promise<File | File[]>;

export interface FileSaveOptions {
  mimeTypes: string[],
  extensions: string[],
  multiple: boolean,
  description: string,
}

export function fileSave(blob: Blob, options?: FileSaveOptions, handle?: FileSystemHandle | null): Promise<void>;

export interface DirectoryOpenOptions {
  recursive: boolean,
  multiple: boolean,
}

export function directoryOpen(options?: DirectoryOpenOptions): Promise<File[]>;

export function imageToBlob(img: HTMLImageElement): Promise<Blob>;
