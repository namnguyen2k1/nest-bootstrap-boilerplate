import { UserPermission } from '@models/user-permission.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const UserPermissionSchema =
  SchemaFactory.createForClass(UserPermission);

UserPermissionSchema.loadClass(UserPermission);

MongodbUtils.customSchemaHooks({ schema: UserPermissionSchema });
