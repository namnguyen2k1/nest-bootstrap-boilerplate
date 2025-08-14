import { User } from '@models/user.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

MongodbUtils.customSchemaHooks({ schema: UserSchema });
