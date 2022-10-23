import * as uuid from 'uuid';
import path from 'path';
import { readFileSync, readdirSync, unlinkSync } from 'fs';

class FileService {
  // Services for file verification
  static isFileExist(folder, fileName) {
    const filePath = path.resolve(folder, fileName);
    return filePath;
  }
  // Services for file manipulation
  static readFile(folder, fileName, options) {
    const { isJson = false } = options;
    const filePath = path.resolve(folder, fileName);
    const file = readFileSync(filePath);
    return isJson ? JSON.parse(file) : file;
  }
  static readFiles(folder, options) {
    const { isJson = false, extensions } = options;
    const filenames = readdirSync(folder);
    const files = filenames.map((filename) => {
      if (extensions && extensions.includes(path.extname(filename))) {
        const file = this.readFile(path, filename, { isJson });
        const fileName = path.basename(filename, path.extname(filename));
        return { fileName, file };
      }
      return null;
    });
    return files;
  }
  static saveFile(folder, file) {
    const fileName = uuid.v4() + path.extname(file.name);
    const filePath = path.resolve(folder, fileName);
    file.mv(filePath);
    return fileName;
  }
  static deleteFile(folder, fileName) {
    const filePath = path.resolve(folder, fileName);
    unlinkSync(filePath);
  }
}

export default FileService;
