import * as uuid from "uuid";
import path from "path";
import fs from "fs";

class FileService {
    readFile(folder, fileName, options) {
        try {
            const { isJson = false } = options;
            const filePath = path.resolve(folder, fileName);
            const file = fs.readFileSync(filePath);
            return isJson ? JSON.parse(file) : file;
        } catch (error) {
            throw error;
        }
    }
    readFiles(folder, options) {
        try {
            const { isJson = false, extensions } = options;
            const filenames = fs.readdirSync(folder);
            const files = filenames.map(filename => {
                if (extensions && extensions.includes(path.extname(filename))) {
                    const file = this.readFile(path, filename, { isJson });
                    const fileName = path.basename(filename, path.extname(filename));
                    return {fileName, file};
                }
            });
            return files;
        } catch (error) {
            throw error;
        }
    }
    saveFile(folder, file) {
        try {
            const fileName = uuid.v4() + path.extname(file.name);
            const filePath = path.resolve(folder, fileName);
            file.mv(filePath);
            return fileName;
        } catch (error) {
            throw error;
        }
    }
    async deleteFile(folder, fileName) {
        try {
            const filePath = path.resolve(folder, fileName);
            await fs.unlinkSync(filePath);
        } catch (error) {
            throw error;
        }
    }
}

export default new FileService();