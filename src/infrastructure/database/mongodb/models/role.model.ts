import { Prop, Schema } from "@nestjs/mongoose";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { DB_COLLECTION } from "../constant";
import { MongodbUtils } from "../mongodb.utils";
import { BaseModel } from "./base.model";

export enum ROLE_KEY {
  ADMIN = "ROLE_KEY_ADMIN",
  CLIENT = "ROLE_KEY_CLIENT",
}

export enum ROLE_STATUS {
  ACTIVE = "ROLE_STATUS_ACTIVE",
  INACTIVE = "ROLE_STATUS_INACTIVE",
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.ROLE,
  }),
)
export class Role extends BaseModel {
  @Prop({
    type: String,
    enum: ROLE_KEY,
    unique: true,
    required: true,
  })
  @IsEnum(ROLE_KEY)
  key: ROLE_KEY;

  @Prop({ required: true })
  @IsString()
  description: string;

  @Prop({ required: true })
  @IsNumber()
  maxDeviceLogin: number;

  @Prop({
    type: String,
    enum: ROLE_STATUS,
    default: ROLE_STATUS.ACTIVE,
  })
  @IsEnum(ROLE_STATUS)
  status: ROLE_STATUS;
}
