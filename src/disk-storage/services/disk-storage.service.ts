import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  async createFile(path: string, file: Express.Multer.File) {
    await fs.promises.writeFile(path, file.buffer);
  }

  async existedFile(path: string) {
    return fs.existsSync(path);
  }

  async verifyFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      originalname: file.originalname,
    };
  }

  async deleteFile(path: string) {
    if (fs.existsSync(path)) {
      await fs.promises.unlink(path);
    }
  }

  getFileStream(path: string) {
    if (!fs.existsSync(path)) {
      throw new NotFoundException(`File not found in path`);
    }
    return fs.createReadStream(path);
  }

  async listFiles(directory: string) {
    const fullPath = join(process.cwd(), directory);
    const result = await fs.promises.readdir(fullPath);
    return result;
  }
}
