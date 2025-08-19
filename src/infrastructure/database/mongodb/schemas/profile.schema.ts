import { Profile } from '@models/profile.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongodbUtils } from '../mongodb.utils';

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.loadClass(Profile);

MongodbUtils.customSchemaHooks({ schema: ProfileSchema });
