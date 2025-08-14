import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DB_COLLECTION } from '../constant';
import { MongodbUtils } from '../mongodb.utils';
import { BaseModel } from './base.model';
import { Permission } from './permission.model';
import { User } from './user.model';

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.USER_PERMISSION,
  }),
)
export class UserPermission extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.USER,
    required: true,
  })
  userId: Types.ObjectId | User;

  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.PERMISSION,
    required: true,
  })
  permissionId: Types.ObjectId | Permission;
}
