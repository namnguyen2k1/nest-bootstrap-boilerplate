import { Device } from "@device/models/device.model";
import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "@user/models/user.model";
import { IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "../../infrastructure/database/mongodb/constant";
import {
  BaseModel,
  BaseMongodbType,
} from "../../infrastructure/database/mongodb/models/base.model";
import { MongodbUtils } from "../../infrastructure/database/mongodb/mongodb.utils";

export interface Token extends BaseMongodbType {
  deviceId: Types.ObjectId | Device;
  userId: Types.ObjectId | User;
  refreshToken: string;
  expiredAt: Date;
  revokedAt?: Date;
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.TOKEN,
  }),
)
export class TokenModel extends BaseModel implements Token {
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
