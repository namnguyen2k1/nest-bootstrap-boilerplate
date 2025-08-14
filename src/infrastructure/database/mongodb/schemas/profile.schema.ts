import { Profile } from '@models/profile.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.loadClass(Profile);

MongodbUtils.customSchemaHooks({ schema: ProfileSchema });
