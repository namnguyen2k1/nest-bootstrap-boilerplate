import { Role } from '@models/role.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.loadClass(Role);

MongodbUtils.customSchemaHooks({ schema: RoleSchema });
