import { PublicAPI } from "@auth/decorators/public-api.decorator";
import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { createReadStream } from "fs";
import { join } from "path";
import { FileService } from "./services/disk-storage.service";

@Controller("disk-storages")
@ApiTags("disk-storages")
@PublicAPI()
export class DiskStorageController {
  constructor(private readonly fileService: FileService) {}

  private readonly prefixPath: string = "uploads";

  @Post("upload-file")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.fileService.verifyFile(file);
    return {
      _message: "Save file successfully",
      data: result,
    };
  }

  @Get(":filename")
  async getFile(@Param("filename") filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), this.prefixPath, filename);
    res.sendFile(filePath);
    return {
      _message: "Get file successfully",
    };
  }

  @Get("download/:filename")
  async downLoadFile(@Param("filename") filename: string): Promise<StreamableFile> {
    const path: string = join(process.cwd(), this.prefixPath, filename);
    const stream = createReadStream(path);
    return new StreamableFile(stream);
  }
}
