import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../infrastructure/database/mongodb/mongodb.utils";
import { Notification } from "./notification.model";

export type NotificationDocument = HydratedDocument<Notification>;

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.loadClass(Notification);

MongodbUtils.customSchemaHooks({ schema: NotificationSchema });
