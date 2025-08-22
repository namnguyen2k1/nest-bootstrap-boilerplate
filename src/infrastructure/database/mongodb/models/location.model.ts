import { Prop, Schema } from "@nestjs/mongoose";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "../constant";
import { MongodbUtils } from "../mongodb.utils";
import { BaseModel } from "./base.model";
import { Device } from "./device.model";

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.LOCATION,
  }),
)
export class Location extends BaseModel {
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
