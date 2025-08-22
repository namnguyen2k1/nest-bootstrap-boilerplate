import { Injectable, NotFoundException } from "@nestjs/common";
import { existsSync } from "fs";
import sharp from "sharp";
import { CompressOptions, CropOptions, ResizeOptions, WatermarkOptions } from "./sharp.type";

@Injectable()
export class ImageProcessingService {
  private validateFileExist(path: string) {
    if (!existsSync(path)) {
      throw new NotFoundException(`File not found: ${path}`);
    }
  }

  async resizeImage(inputPath: string, outputPath: string, options: ResizeOptions): Promise<void> {
    this.validateFileExist(inputPath);

    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: options.fit || "inside",
      })
      .toFile(outputPath);
  }

  async cropImage(inputPath: string, outputPath: string, options: CropOptions): Promise<void> {
    this.validateFileExist(inputPath);

    await sharp(inputPath)
      .extract({
        left: options.left,
        top: options.top,
        width: options.width,
        height: options.height,
      })
      .toFile(outputPath);
  }

  async compressImage(
    inputPath: string,
    outputPath: string,
    options: CompressOptions,
  ): Promise<void> {
    this.validateFileExist(inputPath);

    const image = sharp(inputPath);

    switch (options.format) {
      case "jpeg":
        image.jpeg({ quality: options.quality });
        break;
      case "webp":
        image.webp({ quality: options.quality });
        break;
      case "png":
        image.png({ compressionLevel: 9 });
        break;
    }

    await image.toFile(outputPath);
  }

  async addWatermark(
    inputPath: string,
    outputPath: string,
    options: WatermarkOptions,
  ): Promise<void> {
    this.validateFileExist(inputPath);
    this.validateFileExist(options.watermarkPath);

    const main = sharp(inputPath);
    const { width, height } = await main.metadata();
    if (!width || !height) {
      throw new Error("Cannot determine image dimensions");
    }

    const watermark = sharp(options.watermarkPath);
    const scale = options.scale || 0.2;

    const resizedWatermark = await watermark
      .resize(Math.round(width * scale))
      .png()
      .toBuffer();

    await main
      .composite([
        {
          input: resizedWatermark,
          gravity: options.gravity || "southeast",
        },
      ])
      .toFile(outputPath);
  }
}
