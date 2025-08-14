import { Prop, Schema } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { DB_COLLECTION } from '../constant';
import { MongodbUtils } from '../mongodb.utils';
import { BaseModel } from './base.model';
import { User } from './user.model';

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.PROFILE,
  }),
)
export class Profile extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.USER,
    required: true,
  })
  userId: Types.ObjectId | User;

  @Prop({ required: true })
  @IsString()
  avatarUrl: string;

  @Prop({})
  @IsString()
  @IsOptional()
  coverUrl?: string;
}
