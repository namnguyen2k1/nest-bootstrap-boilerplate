import { BaseModel, BaseMongodbType } from "@models/base.model";
import { Prop, Schema } from "@nestjs/mongoose";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";
import { Device } from "./device.model";

export interface Location extends BaseMongodbType {
  deviceId: Types.ObjectId | Device;
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.LOCATION,
  }),
)
export class LocationModel extends BaseModel implements Location {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.DEVICE,
    required: true,
  })
  deviceId: Types.ObjectId | Device;

  @Prop({ required: true })
  @IsString()
  ip: string;

  @Prop({})
  @IsOptional()
  @IsString()
  country?: string;

  @Prop({})
  @IsOptional()
  @IsString()
  region?: string;

  @Prop({})
  @IsOptional()
  @IsString()
  city?: string;

  @Prop({})
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Prop({})
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
