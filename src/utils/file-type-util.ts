// import { fileTypeFromBlob, FileTypeResult } from 'file-type/browser';

import axios from 'axios';

export class FileTypeUtil {
  static async checkFileType(file: File): Promise<{
    mime: string
  } | undefined> {
    return new Promise((resolve) => {
      resolve({ mime: file.type });
    });
  }

  static changeFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  static changeFileToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  static downloadFileAsArrayBuffer(url: string): Promise<ArrayBuffer | undefined> {
    return new Promise((resolve) => {
      axios.get(url, {
        responseType: 'arraybuffer'
      }).then((data) => {
        console.log(data)
        resolve(data.data);
      }).catch(() => {
        resolve(undefined);
      });
    });
  }
}
