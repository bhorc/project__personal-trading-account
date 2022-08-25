import * as uuid from "uuid";
import * as path from "path";

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
}

export default new FileService();