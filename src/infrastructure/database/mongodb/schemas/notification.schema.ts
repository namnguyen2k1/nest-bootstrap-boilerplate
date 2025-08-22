import { Notification } from "@models/notification.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../mongodb.utils";

export type NotificationDocument = HydratedDocument<Notification>;

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.loadClass(Notification);

MongodbUtils.customSchemaHooks({ schema: NotificationSchema });
