import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(id: string): string {
    if (!id || !isValidObjectId(id)) {
      throw new BadRequestException(`Invalid MongoDB objectID (reading ${id})`);
    }

    return id;
  }
}
