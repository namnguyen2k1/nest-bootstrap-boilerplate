import { RolePermission } from '@models/role-permission.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);

RolePermissionSchema.loadClass(RolePermission);

MongodbUtils.customSchemaHooks({ schema: RolePermissionSchema });
