// CSS-importer med ?inline (Vite/Rolldown) returnerar filinnehållet som sträng
declare module "*.css?inline" {
  const css: string;
  export default css;
}

// File System Access API — finns i Chromium men saknas i lib.dom
interface FilePickerType {
  description?: string;
  accept: Record<string, Array<string>>;
}

interface Window {
  showOpenFilePicker(options?: {
    types?: Array<FilePickerType>;
    multiple?: boolean;
  }): Promise<Array<FileSystemFileHandle>>;
}

interface FileSystemFileHandle {
  requestPermission(descriptor?: {
    mode?: "read" | "readwrite";
  }): Promise<PermissionState>;
}
