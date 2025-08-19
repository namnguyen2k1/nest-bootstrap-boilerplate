import { User } from '@models/user.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongodbUtils } from '../mongodb.utils';

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

MongodbUtils.customSchemaHooks({ schema: UserSchema });
