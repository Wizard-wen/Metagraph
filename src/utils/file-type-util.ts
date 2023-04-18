// import { fileTypeFromBlob, FileTypeResult } from 'file-type/browser';

export class FileTypeUtil {
  static async checkFileType(file: File): Promise<{
    mime: string
  } | undefined> {
    return new Promise((resolve) => {
      resolve({ mime: file.type });
    });
  }

  static handleChange(file: File): Promise<ArrayBuffer> {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
