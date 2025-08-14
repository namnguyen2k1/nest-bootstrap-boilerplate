import { Permission } from '@models/permission.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.loadClass(Permission);

MongodbUtils.customSchemaHooks({ schema: PermissionSchema });
