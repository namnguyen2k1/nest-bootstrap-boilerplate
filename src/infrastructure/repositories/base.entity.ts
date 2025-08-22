import { Prop } from "@nestjs/mongoose";
import { IsOptional } from "class-validator";
import { Types } from "mongoose";

export class BaseEntity {
  id?: string | Types.ObjectId;

  @Prop({ default: null })
  @IsOptional()
  deletedAt?: Date;
}
