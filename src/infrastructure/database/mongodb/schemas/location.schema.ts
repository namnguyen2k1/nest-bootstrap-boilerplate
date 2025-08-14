import { Location } from '@models/location.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.loadClass(Location);

MongodbUtils.customSchemaHooks({ schema: LocationSchema });
