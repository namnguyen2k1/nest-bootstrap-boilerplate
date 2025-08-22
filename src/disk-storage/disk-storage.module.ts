import { Module } from "@nestjs/common";

import { MulterModule } from "@nestjs/platform-express";
import * as fs from "fs";
import multer from "multer";
import path from "path";
import { removeVietnameseTones } from "../shared/utils/remove-vietnamese-tones";
import { DiskStorageController } from "./disk-storage.controller";
import { FileService } from "./services/disk-storage.service";
import { ImageProcessingService } from "./services/image-processing.service";

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: multer.diskStorage({
          destination: (req, file, cb) => {
            const path = "uploads";
            if (!fs.existsSync(path)) {
              fs.mkdirSync(path, { recursive: true });
            }
            cb(null, path);
          },
          filename: (req, file, cb) => {
            const ext: string = path.extname(file.originalname);
            const originalName = path.basename(
              Buffer.from(file.originalname, "latin1").toString("utf8"),
              ext,
            );
            const name = removeVietnameseTones(originalName.normalize(), true).trim();
            cb(null, `${Date.now()}_${name}${ext}`);
          },
        }),
      }),
    }),
  ],
  controllers: [DiskStorageController],
  providers: [FileService, ImageProcessingService],
  exports: [FileService, ImageProcessingService],
})
export class DiskStorageModule {}
