import { BaseModel, BaseMongodbType } from "@models/base.model";
import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "@user/models/user.model";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export enum NOTIFICATION_TYPE {
  USER_EVENT = "NOTIFICATION_TYPE_USER_EVENT",
  SYSTEM_EVENT = "NOTIFICATION_TYPE_SYSTEM_EVENT",
}

export enum NOTIFICATION_STATUS {
  UNREAD = "NOTIFICATION_STATUS_UNREAD",
  READ = "NOTIFICATION_STATUS_READ",
  ARCHIVED = "NOTIFICATION_STATUS_ARCHIVED",
  DELETED = "NOTIFICATION_STATUS_DELETED",
}

export interface Notification extends BaseMongodbType {
  userId: Types.ObjectId | User;
  type: NOTIFICATION_TYPE;
  title: string;
  description: string;
  status: NOTIFICATION_STATUS;
  readAt?: Date;
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.NOTIFICATION,
  }),
)
export class NotificationModel extends BaseModel implements Notification {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.USER,
    required: true,
  })
  userId: Types.ObjectId | User;

  @Prop({
    type: String,
    enum: NOTIFICATION_TYPE,
    required: true,
  })
  @IsEnum(NOTIFICATION_TYPE)
  type: NOTIFICATION_TYPE;

  @Prop({ required: true })
  @IsString()
  title: string;

  @Prop({ required: true })
  @IsString()
  description: string;

  @Prop({
    type: String,
    enum: NOTIFICATION_STATUS,
    default: NOTIFICATION_STATUS.UNREAD,
  })
  @IsEnum(NOTIFICATION_STATUS)
  status: NOTIFICATION_STATUS;

  @Prop({})
  @IsString()
  @IsOptional()
  readAt?: Date;
}
