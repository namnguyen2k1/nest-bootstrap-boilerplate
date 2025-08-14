import { Notification } from '@models/notification.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.loadClass(Notification);

MongodbUtils.customSchemaHooks({ schema: NotificationSchema });
