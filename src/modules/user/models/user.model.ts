import { Prop, Schema } from "@nestjs/mongoose";
import { Role } from "@role/models/role.model";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseModel } from "../../../infrastructure/database/mongodb/models/base.model";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";

export enum USER_STATUS {
  ACTIVE = "USER_STATUS_ACTIVE",
  VERIFYING = "USER_STATUS_VERIFYING",
  BLOCK = "USER_STATUS_BLOCK",
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.USER,
  }),
)
export class User extends BaseModel {
  @Prop({ type: Types.ObjectId, ref: DB_COLLECTION.ROLE, required: true })
  roleId: Types.ObjectId | Role;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({ required: true })
  @IsString()
  password: string;

  @Prop()
  @IsOptional()
  @IsString()
  phone?: string;

  @Prop({
    type: String,
    enum: USER_STATUS,
    default: USER_STATUS.VERIFYING,
  })
  @IsEnum(USER_STATUS)
  status: USER_STATUS;

  @Prop({ default: false })
  @IsString()
  enable2FA: boolean;

  @Prop({})
  @IsString()
  @IsOptional()
  lastLogin?: Date;
}
