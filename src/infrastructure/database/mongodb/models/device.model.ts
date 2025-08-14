import { Prop, Schema } from '@nestjs/mongoose';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { DB_COLLECTION } from '../constant';
import { MongodbUtils } from '../mongodb.utils';
import { BaseModel } from './base.model';
import { User } from './user.model';

export enum DEVICE_STATUS {
  ACTIVE = 'DEVICE_STATUS_ACTIVE',
  INACTIVE = 'DEVICE_STATUS_INACTIVE',
  BLOCK = 'DEVICE_STATUS_BLOCK',
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.DEVICE,
  }),
)
export class Device extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.USER,
    required: true,
  })
  userId: Types.ObjectId | User;

  @Prop({ required: true })
  @IsString()
  ip: string;

  @Prop()
  @IsOptional()
  @IsString()
  deviceType?: string;

  @Prop()
  @IsOptional()
  @IsString()
  deviceName?: string;

  @Prop()
  @IsOptional()
  @IsString()
  os?: string;

  @Prop()
  @IsOptional()
  @IsString()
  browser?: string;

  @Prop()
  @IsOptional()
  @IsString()
  browserVersion?: string;

  @Prop()
  @IsOptional()
  @IsString()
  userAgent?: string;

  @Prop({
    type: String,
    enum: DEVICE_STATUS,
    default: DEVICE_STATUS.INACTIVE,
  })
  @IsOptional()
  @IsEnum(DEVICE_STATUS)
  status?: DEVICE_STATUS;

  @Prop({})
  @IsString()
  @IsOptional()
  lastLogin?: Date;
}
