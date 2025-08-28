import { Device } from "@device/models/device.model";
import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "@user/models/user.model";
import { IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "../constant";
import { MongodbUtils } from "../mongodb.utils";
import { BaseModel } from "./base.model";

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.TOKEN,
  }),
)
export class Token extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.DEVICE,
    required: true,
  })
  deviceId: Types.ObjectId | Device;

  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.USER,
    required: true,
  })
  userId: Types.ObjectId | User;

  @Prop({ required: true })
  @IsString()
  refreshToken: string;

  @Prop({ required: true })
  @IsString()
  expiredAt: Date;

  @Prop({})
  @IsString()
  @IsOptional()
  revokedAt?: Date;
}
