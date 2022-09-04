import * as uuid from "uuid";
import path from "path";
import fs from "fs";

class FileService {
    saveFile(file) {
        try {
            const fileName = uuid.v4() + path.extname(file.name);
            const filePath = path.resolve("./uploads", fileName);
            file.mv(filePath);
            return fileName;
        } catch (error) {
            throw error;
        }
    }
    async deleteFile(fileName) {
        try {
            const filePath = path.resolve("./uploads", fileName);
            await fs.unlink(filePath);
        } catch (error) {
            throw error;
        }
    }
}

export default new FileService();