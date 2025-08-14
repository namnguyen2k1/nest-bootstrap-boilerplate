import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DB_COLLECTION } from '../constant';
import { MongodbUtils } from '../mongodb.utils';
import { BaseModel } from './base.model';
import { Permission } from './permission.model';
import { Role } from './role.model';

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.ROLE_PERMISSION,
  }),
)
export class RolePermission extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.ROLE,
    required: true,
  })
  roleId: Types.ObjectId | Role;

  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.PERMISSION,
    required: true,
  })
  permissionId: Types.ObjectId | Permission;
}
