import { BaseModel, BaseMongodbType } from "@models/base.model";
import { Prop, Schema } from "@nestjs/mongoose";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { DB_COLLECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export enum PERMISSION_KEY {
  // === User Module ===
  USER_READ = "USER_READ",
  USER_CREATE = "USER_CREATE",
  USER_UPDATE = "USER_UPDATE",
  USER_DELETE = "USER_DELETE",

  // === Role Module ===
  ROLE_READ = "ROLE_READ",
  ROLE_CREATE = "ROLE_CREATE",
  ROLE_UPDATE = "ROLE_UPDATE",
  ROLE_DELETE = "ROLE_DELETE",

  // === Post Module ===
  POST_READ = "POST_READ",
  POST_CREATE = "POST_CREATE",
  POST_UPDATE = "POST_UPDATE",
  POST_DELETE = "POST_DELETE",
}

export interface Permission extends BaseMongodbType {
  key: PERMISSION_KEY;
  description: string;
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.PERMISSION,
  }),
)
export class PermissionModel extends BaseModel implements Permission {
  @Prop({
    type: String,
    enum: PERMISSION_KEY,
    unique: true,
    required: true,
  })
  @IsEnum(PERMISSION_KEY)
  key: PERMISSION_KEY;

  @Prop({})
  @IsString()
  @IsOptional()
  description: string;
}
