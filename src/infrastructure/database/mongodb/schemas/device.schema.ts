import { Device } from '@models/device.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { DB_COLLECTION } from '../constant';
import { MongodbUtils } from '../mongodb.utils';

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.loadClass(Device);

DeviceSchema.virtual('location', {
  ref: DB_COLLECTION.LOCATION,
  localField: '_id',
  foreignField: 'deviceId',
});
DeviceSchema.virtual('token', {
  ref: DB_COLLECTION.TOKEN,
  localField: '_id',
  foreignField: 'deviceId',
});

MongodbUtils.customSchemaHooks({ schema: DeviceSchema });
