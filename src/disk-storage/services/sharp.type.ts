import { FitEnum } from "sharp";

export interface ResizeOptions {
  width: number;
  height: number;
  fit?: keyof FitEnum;
}

export interface CropOptions {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CompressOptions {
  format: "jpeg" | "webp" | "png";
  quality: number; // 0 - 100
}

export interface WatermarkOptions {
  watermarkPath: string;
  gravity?: "southeast" | "northwest" | "center" | "northeast" | "southwest";
  scale?: number;
}
